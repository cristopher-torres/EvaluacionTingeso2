package com.toolrent.rate_service.Service;

import com.toolrent.rate_service.Entity.RateEntity;
import com.toolrent.rate_service.Model.Tool;
import com.toolrent.rate_service.Repository.RateRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Service
public class RateService {

    @Autowired
    private RateRepository rateRepository;

    @Autowired
    private RestTemplate restTemplate;

    // URL de M1 (Inventario)
    private final String M1_TOOL_API = "http://M1/api/tools";


    @Transactional
    public RateEntity updateGlobalRates(RateEntity newRate) {
        // Desactivamos la tarifa anterior para mantener historial
        Optional<RateEntity> current = rateRepository.findByActiveTrue();
        if (current.isPresent()) {
            RateEntity old = current.get();
            old.setActive(false);
            rateRepository.save(old);
        }

        // Activamos la nueva tarifa
        newRate.setActive(true);
        return rateRepository.save(newRate);
    }

    public RateEntity getActiveRates() {
        return rateRepository.findByActiveTrue()
                .orElseThrow(() -> new RuntimeException("No hay tarifas globales configuradas."));
    }

    // --- GESTIÓN DE VALORES POR HERRAMIENTA (RF4.3)  ---
    // M4 recibe la petición del Admin y ordena a M1 actualizarse.

    public void updateToolSpecificRates(Long toolId, double dailyRate, double lateRate, double replacementVal, String rutAdmin) {

        // 1. Validar que la herramienta existe en M1
        Tool tool;
        try {
            tool = restTemplate.getForObject(M1_TOOL_API + "/getTool/" + toolId, Tool.class);
        } catch (Exception e) {
            throw new RuntimeException("Error conectando con M1-Inventory");
        }

        if (tool == null) throw new RuntimeException("Herramienta no encontrada");

        // 2. Modificar los valores monetarios en el objeto
        tool.setDailyRate(dailyRate);
        tool.setDailyLateRate(lateRate);
        tool.setReplacementValue(replacementVal);

        // 3. Enviar la actualización a M1
        try {
            // Usamos el endpoint de M1: /updateTool/{toolId}/{rut}
            restTemplate.put(M1_TOOL_API + "/updateTool/" + toolId + "/" + rutAdmin, tool);
        } catch (Exception e) {
            throw new RuntimeException("Error al actualizar tarifas en M1: " + e.getMessage());
        }
    }
}
