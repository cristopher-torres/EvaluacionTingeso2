package com.toolrent.rate_service.Controller;

import com.toolrent.rate_service.Entity.RateEntity;
import com.toolrent.rate_service.Service.RateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rates")
public class RateController {

    @Autowired
    private RateService rateService;

    @GetMapping("/global")
    public ResponseEntity<RateEntity> getGlobalRates() {
        return ResponseEntity.ok(rateService.getActiveRates());
    }

    @PostMapping("/global")
    public ResponseEntity<RateEntity> setGlobalRates(@RequestBody RateEntity rates) {
        return ResponseEntity.ok(rateService.updateGlobalRates(rates));
    }

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