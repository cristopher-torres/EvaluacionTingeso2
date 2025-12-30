package com.toolrent.tool_service.Dto;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ToolStockDTO {
    private String name;
    private String category;
    private long disponible;
    private long prestada;
    private long enReparacion;
    private long dadaDeBaja;
}
