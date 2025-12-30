package com.toolrent.kardex_service.Service;

import com.toolrent.kardex_service.Entity.KardexEntity;
import com.toolrent.kardex_service.Repository.KardexRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class KardexService {

    @Autowired
    private KardexRepository kardexRepository;


    @Transactional
    public KardexEntity save(KardexEntity movement) {
        if (movement.getDateTime() == null) {
            movement.setDateTime(LocalDateTime.now());
        }
        return kardexRepository.save(movement);
    }

    public List<KardexEntity> getMovementsByTool(Long toolId) {
        return kardexRepository.findByToolId(toolId);
    }

    public List<KardexEntity> getMovementsByDateRange(LocalDateTime start, LocalDateTime end) {
        return kardexRepository.findByDateTimeBetween(start, end);
    }
}