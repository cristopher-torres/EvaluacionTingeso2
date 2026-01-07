package com.toolrent.loan_service.Service;

import com.toolrent.loan_service.Entity.LoanEntity;
import com.toolrent.loan_service.Model.Tool;
import com.toolrent.loan_service.Model.User;
import com.toolrent.loan_service.Repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private RestTemplate restTemplate;

    private final String USER_API = "http://M3/api/users";
    private final String TOOL_API = "http://M1/api/tools";
    private final String KARDEX_API = "http://M5/api/kardex";

    @Transactional
    public LoanEntity createLoan(LoanEntity loan, String rut, Long toolId) {

        User user;
        try {
            user = restTemplate.getForObject(USER_API + "/rut/" + rut, User.class);
        } catch (Exception e) {
            throw new RuntimeException("Error al conectar con M3-Users");
        }

        if (user == null) throw new RuntimeException("El cliente no existe");

        if (!"ACTIVO".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("El cliente está RESTRINGIDO");
        }

        long activeLoansCount = loanRepository.countByClientIdAndDeliveredFalse(user.getId());
        if (activeLoansCount >= 5) {
            throw new RuntimeException("El usuario ya tiene 5 préstamos activos");
        }

        Tool tool;
        try {
            tool = restTemplate.getForObject(TOOL_API + "/getTool/" + toolId, Tool.class);
        } catch (Exception e) {
            throw new RuntimeException("Error al conectar con M1-Inventory");
        }

        if (tool == null) throw new RuntimeException("Herramienta no encontrada");

        if (!"DISPONIBLE".equalsIgnoreCase(tool.getStatus())) {
            throw new RuntimeException("La herramienta no está disponible");
        }

        if (loanRepository.existsActiveLoanForToolAndUser(user.getId(), tool.getName())) {
            throw new RuntimeException("El cliente ya tiene un préstamo activo de esta herramienta");
        }

        loan.setClientId(user.getId());
        loan.setClientRut(user.getRut());
        loan.setToolId(tool.getId());
        loan.setToolName(tool.getName());

        if (loan.getStartDate() == null) loan.setStartDate(LocalDate.now());

        long days = ChronoUnit.DAYS.between(loan.getStartDate(), loan.getScheduledReturnDate());
        if (days <= 0) days = 1;
        loan.setLoanPrice(days * tool.getDailyRate());

        LoanEntity savedLoan = loanRepository.save(loan);

        restTemplate.put(TOOL_API + "/status/" + toolId + "?status=PRESTADA", null);

        registerKardexMovement("PRESTAMO", toolId, 1, rut, "Préstamo ID: " + savedLoan.getId());

        return savedLoan;
    }

    @Transactional
    public LoanEntity returnLoan(Long loanId, boolean damaged, boolean irreparable, String rut) {
        LoanEntity loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));

        if (loan.isDelivered()) throw new RuntimeException("El préstamo ya fue devuelto");

        Tool tool = restTemplate.getForObject(TOOL_API + "/getTool/" + loan.getToolId(), Tool.class);
        if (tool == null) throw new RuntimeException("Herramienta no encontrada en M1");

        loan.setReturnDate(LocalDate.now());
        loan.setDelivered(true);

        double damagePrice = 0.0;
        String kardexType = "DEVOLUCION";

        if (damaged) {
            if (irreparable) {
                // Caso Daño Irreparable
                restTemplate.put(TOOL_API + "/decommission/" + loan.getToolId() + "/" + rut, null);
                damagePrice = tool.getReplacementValue();
                kardexType = "BAJA";
            } else {
                // Caso Daño Reparable
                restTemplate.put(TOOL_API + "/status/" + loan.getToolId() + "?status=EN_REPARACION", null);
                damagePrice = tool.getRepairValue();

                // Registramos movimiento de reparación en Kardex (M5)
                registerKardexMovement("REPARACION", loan.getToolId(), 1, rut, "Ingreso a reparación por devolución con daños");
            }
        } else {
            // Devolución Normal
            restTemplate.put(TOOL_API + "/status/" + loan.getToolId() + "?status=DISPONIBLE", null);
        }

        loan.setDamagePrice(damagePrice);
        loan.setTotal(loan.getLoanPrice() + damagePrice + loan.getFine());
        loan.setFineTotal(loan.getFine() + damagePrice);
        loan.setLoanStatus("DEVUELTO");

        LoanEntity savedLoan = loanRepository.save(loan);

        // Registramos la devolución en Kardex (M5)
        registerKardexMovement(kardexType, loan.getToolId(), 1, rut, "Devolución Préstamo ID: " + loanId);

        return savedLoan;
    }

    @EventListener(ApplicationReadyEvent.class)
    @Scheduled(cron = "0 0 0 * * ?", zone = "America/Santiago")
    @Transactional
    public void updateOverdueLoans() {
        LocalDate today = LocalDate.now();
        List<LoanEntity> activeLoans = loanRepository.findActiveLoansOrderedByDateDesc();

        for (LoanEntity loan : activeLoans) {
            if (!loan.isDelivered() && loan.getScheduledReturnDate().isBefore(today)) {

                loan.setLoanStatus("ATRASADO");

                try {
                    restTemplate.put(USER_API + "/" + loan.getClientId() + "/restrict", null);
                } catch (Exception e) {
                    System.err.println("Error restringiendo usuario: " + e.getMessage());
                }

                long daysLate = ChronoUnit.DAYS.between(loan.getScheduledReturnDate(), today);

                Tool tool = restTemplate.getForObject(TOOL_API + "/getTool/" + loan.getToolId(), Tool.class);
                double dailyLateRate = (tool != null) ? tool.getDailyLateRate() : 0.0;

                loan.setFine(daysLate * dailyLateRate);
                loanRepository.save(loan);
            }
        }
    }

    @Transactional
    public LoanEntity updateFinePaid(Long loanId, boolean finePaid) {
        LoanEntity loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));

        loan.setFinePaid(finePaid);
        loanRepository.save(loan);

        try {
            restTemplate.put(USER_API + "/" + loan.getClientId() + "/status?finePaid=" + finePaid, null);
        } catch (Exception e) {
            System.err.println("Error actualizando estado usuario: " + e.getMessage());
        }

        return loan;
    }

    private void registerKardexMovement(String type, Long toolId, int quantity, String rut, String detail) {
        try {
            Map<String, Object> movement = new HashMap<>();
            movement.put("type", type);
            movement.put("toolId", toolId);
            movement.put("quantity", quantity);
            movement.put("userRut", rut);
            movement.put("detail", detail);

            restTemplate.postForObject(KARDEX_API + "/create", movement, Object.class);
        } catch (Exception e) {
            System.err.println("Error reportando al Kardex: " + e.getMessage());
        }
    }

    public List<LoanEntity> getAllLoans() { return loanRepository.findAll(); }
    public List<LoanEntity> getActiveLoans() { return loanRepository.findActiveLoansOrderedByDateDesc(); }
    public List<LoanEntity> getActiveLoansByDate(LocalDate s, LocalDate e) { return loanRepository.findActiveLoansByDateRange(s, e); }
    public List<LoanEntity> getOverdueClients() { return loanRepository.findOverdueLoans(LocalDate.now()); }
    public List<LoanEntity> getOverdueLoansByDate(LocalDate s, LocalDate e) { return loanRepository.findOverdueLoansByDate(LocalDate.now(), s, e); }
    public List<Object[]> getTopLentToolsAllTime() { return loanRepository.findTopLentToolsAllTime(); }
    public List<Object[]> getTopLentTools(LocalDate s, LocalDate e) { return loanRepository.findTopLentToolsByName(s, e); }
    public List<LoanEntity> getUnpaidLoans() { return loanRepository.findByFinePaidFalse(); }
}
