package com.toolrent.rate_service.Controller;

import com.toolrent.rate_service.Entity.RateEntity;
import com.toolrent.rate_service.Service.RateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rates")
@CrossOrigin("*")
public class RateController {

    @Autowired
    private RateService rateService;

    // Obtener configuración global actual
    @GetMapping("/global")
    public ResponseEntity<RateEntity> getGlobalRates() {
        return ResponseEntity.ok(rateService.getActiveRates());
    }

    // RF4.1 y RF4.2: Guardar nuevas tarifas globales
    @PostMapping("/global")
    public ResponseEntity<RateEntity> setGlobalRates(@RequestBody RateEntity rates) {
        return ResponseEntity.ok(rateService.updateGlobalRates(rates));
    }

    // RF4.3: Actualizar valores de una herramienta específica
    // El admin usa este endpoint en M4, y M4 se comunica con M1.
    @PutMapping("/tool/{toolId}")
    public ResponseEntity<String> updateToolRates(
            @PathVariable Long toolId,
            @RequestParam double dailyRate,
            @RequestParam double lateRate,
            @RequestParam double replacementVal,
            @RequestParam String rutAdmin
    ) {
        rateService.updateToolSpecificRates(toolId, dailyRate, lateRate, replacementVal, rutAdmin);
        return ResponseEntity.ok("Tarifas de la herramienta actualizadas correctamente.");
    }
}