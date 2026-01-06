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

    @Column(name = "daily_rate")
    private double dailyRate;

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
