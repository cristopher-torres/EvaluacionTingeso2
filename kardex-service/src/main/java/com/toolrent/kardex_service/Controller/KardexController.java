package com.toolrent.kardex_service.Controller;

import com.toolrent.kardex_service.Entity.KardexEntity;
import com.toolrent.kardex_service.Service.KardexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/kardex")
public class KardexController {

    @Autowired
    private KardexService kardexService;

    // Endpoint para registrar movimientos (Usado por los otros Microservicios)
    @PostMapping("/create")
    public ResponseEntity<KardexEntity> createMovement(@RequestBody KardexEntity movement) {
        return ResponseEntity.ok(kardexService.save(movement));
    }

    @GetMapping("/tool/{toolId}")
    public ResponseEntity<List<KardexEntity>> getMovementsByTool(@PathVariable Long toolId) {
        return ResponseEntity.ok(kardexService.getMovementsByTool(toolId));
    }

    @GetMapping("/dates")
    public ResponseEntity<List<KardexEntity>> getMovementsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(kardexService.getMovementsByDateRange(start, end));
    }
}
