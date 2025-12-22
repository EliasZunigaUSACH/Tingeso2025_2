package com.tutorial.tool_service.repository;

import com.tutorial.tool_service.entity.Tool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ToolRepository extends JpaRepository<Tool, Long> {
    public List<Tool> findByStatus(int status);

    public List<Tool> findByCategory(String category);

    public List<Tool> findByNameAndStatus(String name, int status);
}
