package com.toolrent.tool_service.Controller;

import com.toolrent.tool_service.Dto.ToolStockDTO;
import com.toolrent.tool_service.Entity.ToolsEntity;
import com.toolrent.tool_service.Service.ToolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tools")
public class ToolsController {

    @Autowired
    private ToolService toolsService;

    @PostMapping("/createTool/{quantity}/{rut}")
    public ResponseEntity<ToolsEntity> createTool(
            @RequestBody ToolsEntity tool,
            @PathVariable("quantity") int quantity,
            @PathVariable("rut") String rut
    ) {
        return ResponseEntity.ok(toolsService.registerTool(tool, quantity, rut));
    }

    @GetMapping("/getTools")
    public ResponseEntity<List<ToolsEntity>> getAllTools() {
        return ResponseEntity.ok(toolsService.findAll());
    }

    @GetMapping("/stock")
    public ResponseEntity<List<ToolStockDTO>> getToolsStock() {
        return ResponseEntity.ok(toolsService.getToolsStock());
    }

    @PutMapping("/updateTool/{toolId}/{rut}")
    public ResponseEntity<ToolsEntity> updateTool(
            @PathVariable Long toolId,
            @PathVariable String rut,
            @RequestBody ToolsEntity toolDetails) {
        return ResponseEntity.ok(toolsService.updateTool(toolId, toolDetails, rut));
    }

    // Endpoint para dar de baja
    @PutMapping("/decommission/{toolId}/{rut}")
    public ResponseEntity<ToolsEntity> decommissionTool(@PathVariable Long toolId, @PathVariable String rut) {
        return ResponseEntity.ok(toolsService.decommissionTool(toolId, rut));
    }

    @GetMapping("/getTool/{toolId}")
    public ResponseEntity<ToolsEntity> getToolById(@PathVariable Long toolId) {
        return ResponseEntity.ok(toolsService.findById(toolId));
    }


    @GetMapping("/available/{id}")
    public ResponseEntity<ToolsEntity> getAvailableTool(@PathVariable Long id) {
        return ResponseEntity.ok(toolsService.getAvailableTool(id));
    }


    @PutMapping("/status/{id}")
    public ResponseEntity<Void> updateStatus(@PathVariable Long id, @RequestParam String status) {
        if ("PRESTADA".equals(status)) {
            toolsService.loanTool(id);
        } else if ("DISPONIBLE".equals(status)) {
            toolsService.returnTool(id);
        } else if ("EN_REPARACION".equals(status)) {
            toolsService.sendToRepair(id);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/available")
    public List<ToolsEntity> getAvailableTools() {
        return toolsService.getAvailableTools();
    }

    @GetMapping("/getToolsByName/{name}")
    public ResponseEntity<List<ToolsEntity>> getToolsByName(@PathVariable String name) {
        List<ToolsEntity> tools = toolsService.getToolsByName(name);
        if (tools.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(tools);
    }
}
