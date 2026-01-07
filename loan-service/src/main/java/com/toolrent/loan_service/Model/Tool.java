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

    private double dailyRate;
    private double dailyLateRate;
    private double replacementValue;
    private double repairValue;

    private String status;
}
