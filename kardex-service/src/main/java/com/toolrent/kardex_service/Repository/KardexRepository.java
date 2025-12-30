package com.toolrent.kardex_service.Repository;


import com.toolrent.kardex_service.Entity.KardexEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface KardexRepository extends JpaRepository<KardexEntity, Long> {

    List<KardexEntity> findByToolId(Long toolId);
    List<KardexEntity> findByDateTimeBetween(LocalDateTime start, LocalDateTime end);
}