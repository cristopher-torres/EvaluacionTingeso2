package com.toolrent.loan_service.Controller;

import com.toolrent.loan_service.Entity.LoanEntity;
import com.toolrent.loan_service.Service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    @Autowired
    private LoanService loanService;

    // 1. Crear Préstamo
    // Cambio clave: Recibimos toolId en la URL para ser explícitos con el ID de la herramienta
    @PostMapping("/createLoan/{rut}/{toolId}")
    public ResponseEntity<LoanEntity> createLoan(
            @PathVariable String rut,
            @PathVariable Long toolId,
            @RequestBody LoanEntity loan
    ) {
        // Delegamos al servicio pasando los IDs necesarios
        LoanEntity createdLoan = loanService.createLoan(loan, rut, toolId);
        return ResponseEntity.ok(createdLoan);
    }

    // 2. Devolver Préstamo
    @PostMapping("/returnLoan/{loanId}/{rut}")
    public ResponseEntity<LoanEntity> returnLoan(
            @PathVariable Long loanId,
            @PathVariable String rut,
            @RequestParam(required = false, defaultValue = "false") boolean damaged,
            @RequestParam(required = false, defaultValue = "false") boolean irreparable
    ) {
        LoanEntity returnedLoan = loanService.returnLoan(loanId, damaged, irreparable, rut);
        return ResponseEntity.ok(returnedLoan);
    }

    // 3. Obtener todos los préstamos (Historial completo)
    @GetMapping("/getLoans")
    public ResponseEntity<List<LoanEntity>> getAllLoans() {
        return ResponseEntity.ok(loanService.getAllLoans());
    }

    // 4. Obtener solo préstamos activos (No devueltos)
    @GetMapping("/loansActive")
    public ResponseEntity<List<LoanEntity>> getActiveLoans() {
        return ResponseEntity.ok(loanService.getActiveLoans());
    }

    // 5. Pagar Multa (Desbloquea al usuario en M3)
    @PutMapping("/{loanId}/finePaid")
    public ResponseEntity<LoanEntity> updateFinePaid(@PathVariable Long loanId, @RequestParam boolean finePaid) {
        LoanEntity updatedLoan = loanService.updateFinePaid(loanId, finePaid);
        return ResponseEntity.ok(updatedLoan);
    }

    // 6. Préstamos activos por rango de fechas (Reportes)
    @GetMapping("/loansActiveByDate")
    public ResponseEntity<List<LoanEntity>> getActiveLoansByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<LoanEntity> loans = loanService.getActiveLoansByDate(startDate, endDate);
        return ResponseEntity.ok(loans);
    }

    // 7. Clientes con atrasos (Reportes)
    @GetMapping("/overdueClients")
    public ResponseEntity<List<LoanEntity>> getOverdueClients() {
        return ResponseEntity.ok(loanService.getOverdueClients());
    }

    // 8. Atrasos filtrados por fecha (Reportes)
    @GetMapping("/overdueClients/dateRange")
    public ResponseEntity<List<LoanEntity>> getOverdueClientsByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(loanService.getOverdueLoansByDate(startDate, endDate));
    }

    // 9. Ranking de herramientas (Reportes) - Por fechas
    @GetMapping("/topToolsByDate")
    public ResponseEntity<List<Object[]>> getTopToolsByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(loanService.getTopLentTools(startDate, endDate));
    }

    // 10. Ranking histórico (Reportes)
    @GetMapping("/topTools")
    public ResponseEntity<List<Object[]>> getTopTools() {
        return ResponseEntity.ok(loanService.getTopLentToolsAllTime());
    }

    // 11. Préstamos con deuda impaga
    @GetMapping("/unpaid")
    public ResponseEntity<List<LoanEntity>> getUnpaidLoans() {
        return ResponseEntity.ok(loanService.getUnpaidLoans());
    }
}
