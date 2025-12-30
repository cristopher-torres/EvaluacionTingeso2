package com.toolrent.loan_service.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "loans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    // --- RELACIONES POR ID (Microservicios) ---
    @Column(name = "tool_id", nullable = false)
    private Long toolId;

    @Column(name = "client_id", nullable = false)
    private Long clientId;

    // --- SNAPSHOTS (Datos copiados para reportes históricos) ---
    private String toolName;
    private String clientRut;

    @Column(nullable = false)
    private LocalDate startDate;
    @Column(nullable = false)
    private LocalDate scheduledReturnDate;
    private LocalDate returnDate;

    private boolean delivered = false;
    private String loanStatus = "Vigente";

    private double fine;
    private double loanPrice;
    private double damagePrice;
    private double fineTotal;
    private double total;

    @Column(name = "is_fine_paid", nullable = false)
    private boolean finePaid = true;

    @Column(nullable = false)
    private LocalDateTime createdLoan;

    @PrePersist
    public void prePersist() {
        if (this.createdLoan == null) {
            this.createdLoan = LocalDateTime.now();
        }
    }
}
