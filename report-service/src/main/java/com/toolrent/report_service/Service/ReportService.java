package com.toolrent.report_service.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Collections;

@Service
public class ReportService {

    @Autowired
    private RestTemplate restTemplate;


    private final String M2_URL = "http://M2/api/loans";

    public List<Object> getActiveLoansReport(LocalDate start, LocalDate end) {
        try {
            // Si las fechas son nulas, M2 podría tener un endpoint sin filtros o usamos valores por defecto
            String url = M2_URL + "/loansActiveByDate?startDate=" + start + "&endDate=" + end;
            Object[] loans = restTemplate.getForObject(url, Object[].class);
            return loans != null ? Arrays.asList(loans) : Collections.emptyList();
        } catch (Exception e) {
            System.err.println("Error obteniendo reporte de préstamos activos: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<Object> getOverdueClientsReport(LocalDate start, LocalDate end) {
        try {
            // Reutilizamos el endpoint de M2 que filtra atrasos por fecha
            String url = M2_URL + "/overdueClients/dateRange?startDate=" + start + "&endDate=" + end;
            Object[] loans = restTemplate.getForObject(url, Object[].class);
            return loans != null ? Arrays.asList(loans) : Collections.emptyList();
        } catch (Exception e) {
            System.err.println("Error obteniendo reporte de atrasos: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<Object> getTopToolsRanking(LocalDate start, LocalDate end) {
        try {
            String url;
            if (start != null && end != null) {
                url = M2_URL + "/topToolsByDate?startDate=" + start + "&endDate=" + end;
            } else {
                url = M2_URL + "/topTools";
            }

            Object[] ranking = restTemplate.getForObject(url, Object[].class);
            return ranking != null ? Arrays.asList(ranking) : Collections.emptyList();
        } catch (Exception e) {
            System.err.println("Error obteniendo ranking de herramientas: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<Object> getUnpaidLoansReport() {
        try {
            String url = M2_URL + "/unpaid";

            Object[] unpaidLoans = restTemplate.getForObject(url, Object[].class);
            return unpaidLoans != null ? Arrays.asList(unpaidLoans) : Collections.emptyList();
        } catch (Exception e) {
            System.err.println("Error obteniendo reporte de deuda impaga: " + e.getMessage());
            return Collections.emptyList();
        }
    }
}
