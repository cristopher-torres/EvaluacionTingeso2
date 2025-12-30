package com.toolrent.loan_service.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tool {
    private Long id;
    private String name;
    private String model;
    private String brand;

    // Precios necesarios para la lógica del préstamo
    private double dailyRate;     // Precio por día de arriendo
    private double dailyLateRate;    // Multa por día de atraso
    private double replacementValue; // Costo si la pierden/rompen total
    private double repairValue;      // Costo si la dañan (reparable)

    private String status;           // "DISPONIBLE", "EN_MANTENCION", etc.
}
