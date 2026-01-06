package com.toolrent.tool_service.Service;

import com.toolrent.tool_service.Dto.ToolStockDTO;
import com.toolrent.tool_service.Entity.ToolStatus;
import com.toolrent.tool_service.Entity.ToolsEntity;
import com.toolrent.tool_service.Repository.ToolsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ToolService {

    @Autowired
    private ToolsRepository toolsRepository;

    @Autowired
    private RestTemplate restTemplate;

    private final String KARDEX_SERVICE_URL = "http://M5/api/kardex";

    @Transactional
    public ToolsEntity registerTool(ToolsEntity tool, int quantity, String rut) {

        if (tool.getName() == null || tool.getName().isBlank()) {
            throw new IllegalArgumentException("Se debe ingresar el nombre");
        }
        if (tool.getCategory() == null || tool.getCategory().isBlank()) {
            throw new IllegalArgumentException("Se debe ingresar la categoría");
        }
        if (tool.getReplacementValue() <= 0) {
            throw new IllegalArgumentException("El valor de reposición debe ser mayor que 0");
        }

        ToolsEntity firstSaved = null;

        for (int i = 0; i < quantity; i++) {
            ToolsEntity unit = new ToolsEntity();
            unit.setName(tool.getName());
            unit.setCategory(tool.getCategory());
            unit.setReplacementValue(tool.getReplacementValue());
            unit.setDailyRate(tool.getDailyRate());
            unit.setDailyLateRate(tool.getDailyLateRate());
            unit.setRepairValue(tool.getRepairValue());
            unit.setStatus(ToolStatus.DISPONIBLE);

            ToolsEntity savedTool = toolsRepository.save(unit);

            if (i == 0) {
                firstSaved = savedTool;
            }

            // se conecta con M5
            sendKardexMovement("INGRESO", savedTool.getId(), 1, rut);
        }

        return firstSaved;
    }

    @Transactional
    public ToolsEntity decommissionTool(Long toolId, String rut) {
        ToolsEntity tool = toolsRepository.findById(toolId)
                .orElseThrow(() -> new RuntimeException("Herramienta no encontrada"));

        tool.setStatus(ToolStatus.DADA_DE_BAJA);

        // se conecta con M5
        sendKardexMovement("BAJA", tool.getId(), 1, rut);

        return toolsRepository.save(tool);
    }

    public List<ToolsEntity> findAll() {
        return toolsRepository.findAll();
    }

    public ToolsEntity findById(Long id) {
        return toolsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Herramienta no encontrada"));
    }

    @Transactional
    public ToolsEntity getAvailableTool(long id) {
        return toolsRepository.findByIdAndStatus(id, ToolStatus.DISPONIBLE)
                .orElseThrow(() -> new RuntimeException("No hay unidades disponibles para préstamo"));
    }

    // Este metodo se ocupara en m2
    @Transactional
    public void loanTool(Long toolId) {
        ToolsEntity tool = toolsRepository.findById(toolId)
                .orElseThrow(() -> new RuntimeException("Herramienta no encontrada"));

        if (tool.getStatus() != ToolStatus.DISPONIBLE) {
            throw new RuntimeException("La herramienta no está disponible");
        }

        tool.setStatus(ToolStatus.PRESTADA);
        toolsRepository.save(tool);
    }

    // Este metodo se ocupara en m2
    @Transactional
    public void returnTool(Long toolId) {
        ToolsEntity tool = toolsRepository.findById(toolId)
                .orElseThrow(() -> new RuntimeException("Herramienta no encontrada"));

        if (tool.getStatus() != ToolStatus.PRESTADA) {
            throw new RuntimeException("La herramienta no estaba prestada");
        }

        tool.setStatus(ToolStatus.DISPONIBLE);
        toolsRepository.save(tool);
    }

    public List<ToolStockDTO> getToolsStock() {
        List<Object[]> toolNameCategory = toolsRepository.findDistinctNameAndCategory();
        List<ToolStockDTO> stockList = new ArrayList<>();

        for (Object[] pair : toolNameCategory) {
            String name = (String) pair[0];
            String category = (String) pair[1];

            ToolStockDTO dto = new ToolStockDTO();
            dto.setName(name);
            dto.setCategory(category);
            dto.setDisponible(toolsRepository.countByNameAndCategoryAndStatus(name, category, ToolStatus.DISPONIBLE));
            dto.setPrestada(toolsRepository.countByNameAndCategoryAndStatus(name, category, ToolStatus.PRESTADA));
            dto.setEnReparacion(toolsRepository.countByNameAndCategoryAndStatus(name, category, ToolStatus.EN_REPARACION));
            dto.setDadaDeBaja(toolsRepository.countByNameAndCategoryAndStatus(name, category, ToolStatus.DADA_DE_BAJA));
            stockList.add(dto);
        }
        return stockList;
    }

    @Transactional
    public ToolsEntity updateTool(Long toolId, ToolsEntity toolDetails, String rut) {
        ToolsEntity tool = toolsRepository.findById(toolId)
                .orElseThrow(() -> new RuntimeException("Herramienta no encontrada"));

        ToolStatus oldStatus = tool.getStatus();

        tool.setName(toolDetails.getName());
        tool.setCategory(toolDetails.getCategory());
        tool.setReplacementValue(toolDetails.getReplacementValue());
        tool.setDailyRate(toolDetails.getDailyRate());
        tool.setDailyLateRate(toolDetails.getDailyLateRate());
        tool.setRepairValue(toolDetails.getRepairValue());
        tool.setStatus(toolDetails.getStatus());

        ToolsEntity updatedTool = toolsRepository.save(tool);

        // Lógica de Kardex externalizada a M5
        if (oldStatus != tool.getStatus() && tool.getStatus() == ToolStatus.EN_REPARACION) {
            sendKardexMovement("REPARACION", updatedTool.getId(), 1, rut);
        }

        if (oldStatus != tool.getStatus() && tool.getStatus() == ToolStatus.DADA_DE_BAJA) {
            sendKardexMovement("BAJA", updatedTool.getId(), 1, rut);
        }

        return updatedTool;
    }

    public List<ToolsEntity> getAvailableTools() {
        return toolsRepository.findByStatus(ToolStatus.DISPONIBLE);
    }

    private void sendKardexMovement(String type, Long toolId, int quantity, String userRut) {
        try {
            Map<String, Object> movement = new HashMap<>();
            movement.put("type", type);
            movement.put("toolId", toolId); // Solo enviamos el ID
            movement.put("quantity", quantity);
            movement.put("userRut", userRut);

            restTemplate.postForObject(KARDEX_SERVICE_URL + "/create", movement, Object.class);
        } catch (Exception e) {
            System.err.println("Error al comunicar con Microservicio Kardex: " + e.getMessage());
        }
    }

    @Transactional
    public void sendToRepair(Long toolId) {
        ToolsEntity tool = toolsRepository.findById(toolId)
                .orElseThrow(() -> new RuntimeException("Herramienta no encontrada"));

        // Cambiamos el estado
        tool.setStatus(ToolStatus.EN_REPARACION);
        toolsRepository.save(tool);
    }

    public List<ToolsEntity> getToolsByName(String name) {
        return toolsRepository.findByName(name);
    }
}