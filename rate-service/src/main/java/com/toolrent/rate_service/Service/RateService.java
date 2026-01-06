package com.toolrent.rate_service.Service;

import com.toolrent.rate_service.Entity.RateEntity;
import com.toolrent.rate_service.Model.Tool;
import com.toolrent.rate_service.Repository.RateRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Optional;

@Service
public class RateService {

    @Autowired
    private RateRepository rateRepository;

    @Autowired
    private RestTemplate restTemplate;

    // URL de M1
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

    public void updateToolSpecificRates(Long toolId, double dailyRate, double lateRate, double replacementVal, String rutAdmin) {
        Tool toolReference = restTemplate.getForObject(M1_TOOL_API + "/getTool/" + toolId, Tool.class);

        if (toolReference == null) {
            throw new RuntimeException("Herramienta no encontrada");
        }

        String targetName = toolReference.getName();

        Tool[] toolsToUpdate = restTemplate.getForObject(M1_TOOL_API + "/getToolsByName/" + targetName, Tool[].class);

        if (toolsToUpdate == null || toolsToUpdate.length == 0) {
            return;
        }

        Arrays.stream(toolsToUpdate).forEach(tool -> {
            tool.setDailyRate(dailyRate);
            tool.setDailyLateRate(lateRate);
            tool.setReplacementValue(replacementVal);

            try {
                restTemplate.put(M1_TOOL_API + "/updateTool/" + tool.getId() + "/" + rutAdmin, tool);
            } catch (Exception e) {
                System.err.println(e.getMessage());
            }
        });
    }
}
