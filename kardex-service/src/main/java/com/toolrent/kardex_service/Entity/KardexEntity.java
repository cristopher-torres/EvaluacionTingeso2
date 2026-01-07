package com.toolrent.kardex_service.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "kardex")
@Data
@NoArgsConstructor
public class KardexEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @Column(nullable = false)
    private String type; // "PRESTAMO", "DEVOLUCION", "BAJA", "REPARACION"

    @Column(nullable = false)
    private LocalDateTime dateTime;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "tool_id", nullable = false)
    private Long toolId;

    @Column(name = "loan_id")
    private Long loanId;

    private String userRut;


    @PrePersist
    public void prePersist() {
        if (this.dateTime == null) {
            this.dateTime = LocalDateTime.now();
        }
    }
}