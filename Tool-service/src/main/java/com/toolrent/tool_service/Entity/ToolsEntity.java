package com.toolrent.tool_service.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tools")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ToolsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    private String name;
    private String category;
    private double replacementValue;
    private double repairValue;
    private double dailyRate;
    private double dailyLateRate;

    @Enumerated(EnumType.STRING)
    private ToolStatus status;
}
