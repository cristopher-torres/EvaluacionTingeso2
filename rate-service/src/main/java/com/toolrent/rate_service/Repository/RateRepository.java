package com.toolrent.rate_service.Repository;

import com.toolrent.rate_service.Entity.RateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RateRepository extends JpaRepository<RateEntity, Long> {

    // Busca la configuración de tarifas activa actualmente
    Optional<RateEntity> findByActiveTrue();
}