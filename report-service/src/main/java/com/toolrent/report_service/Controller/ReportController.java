package com.toolrent.report_service.Controller;

import com.toolrent.report_service.Service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    // RF6.1 Reporte de Préstamos Activos
    @GetMapping("/active-loans")
    public ResponseEntity<List<Object>> getActiveLoans(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        // Validación de fechas por defecto si vienen vacías
        if (startDate == null) startDate = LocalDate.now().minusMonths(1);
        if (endDate == null) endDate = LocalDate.now();

        return ResponseEntity.ok(reportService.getActiveLoansReport(startDate, endDate));
    }

    // RF6.2 Reporte de Clientes Atrasados
    @GetMapping("/overdue")
    public ResponseEntity<List<Object>> getOverdueReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        if (startDate == null) startDate = LocalDate.now().minusMonths(1);
        if (endDate == null) endDate = LocalDate.now();

        return ResponseEntity.ok(reportService.getOverdueClientsReport(startDate, endDate));
    }

    // RF6.3 Ranking de Herramientas
    @GetMapping("/ranking")
    public ResponseEntity<List<Object>> getRanking(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        // Aquí permitimos nulos para que el servicio decida si trae el histórico completo
        return ResponseEntity.ok(reportService.getTopToolsRanking(startDate, endDate));
    }

    @GetMapping("/unpaid")
    public ResponseEntity<List<Object>> getUnpaidLoans() {
        return ResponseEntity.ok(reportService.getUnpaidLoansReport());
    }
}
