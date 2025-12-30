package com.toolrent.rate_service.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "rates")
@Data
@NoArgsConstructor
public class RateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // RF4.1: Tarifa diaria de arriendo por defecto [cite: 92]
    @Column(name = "daily_rate")
    private double dailyRate;

    // RF4.2: Tarifa diaria de multa por defecto [cite: 93]
    @Column(name = "daily_late_rate")
    private double dailyLateRate;

    // Identificador para saber cuál es la configuración activa
    private boolean active;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
