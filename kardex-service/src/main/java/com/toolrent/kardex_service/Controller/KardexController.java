package com.toolrent.kardex_service.Controller;;

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

    // 1. Endpoint para registrar movimientos (Usado por los otros Microservicios)
    @PostMapping("/create")
    public ResponseEntity<KardexEntity> createMovement(@RequestBody KardexEntity movement) {
        return ResponseEntity.ok(kardexService.save(movement));
    }

    // 2. Endpoint para tu función fetchMovementsByTool
    // React llamará a: GET /api/kardex/tool/{id}
    @GetMapping("/tool/{toolId}")
    public ResponseEntity<List<KardexEntity>> getMovementsByTool(@PathVariable Long toolId) {
        return ResponseEntity.ok(kardexService.getMovementsByTool(toolId));
    }

    // 3. Endpoint para tu función fetchMovementsByDateRange
    // React llamará a: GET /api/kardex/dates?start=2025-10-01T00:00:00&end=...
    @GetMapping("/dates")
    public ResponseEntity<List<KardexEntity>> getMovementsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(kardexService.getMovementsByDateRange(start, end));
    }
}
