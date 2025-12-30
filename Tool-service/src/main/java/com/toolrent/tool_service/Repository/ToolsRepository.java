package com.toolrent.tool_service.Repository;

import com.toolrent.tool_service.Entity.ToolStatus;
import com.toolrent.tool_service.Entity.ToolsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ToolsRepository extends JpaRepository<ToolsEntity, Long> {

    // Buscar la primera herramienta disponible por ID y status
    Optional<ToolsEntity> findByIdAndStatus(Long id, ToolStatus status);

    @Query("SELECT DISTINCT t.name, t.category FROM ToolsEntity t")
    List<Object[]> findDistinctNameAndCategory();

    int countByNameAndCategoryAndStatus(String name, String category, ToolStatus status);

    List<ToolsEntity> findByStatus(ToolStatus status);
}