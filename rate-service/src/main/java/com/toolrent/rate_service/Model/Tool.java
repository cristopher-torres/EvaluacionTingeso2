package com.toolrent.rate_service.Model;

import lombok.Data;

@Data
public class Tool {
    private Long id;
    private String name;
    private String category;

    private double dailyRate;
    private double dailyLateRate;
    private double replacementValue;
    private double repairValue;

    private String status;
}
