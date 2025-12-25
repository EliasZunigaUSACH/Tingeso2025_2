package com.tutorial.tool_service.controller;

import com.tutorial.tool_service.entity.Tool;
import com.tutorial.tool_service.service.ToolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tools")
public class ToolController {

    @Autowired
    ToolService toolService;

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/")
    public ResponseEntity<List<Tool>> getAll() {
        List<Tool> tools = toolService.getAll();
        if(tools.isEmpty())
            return ResponseEntity.noContent().build();
        return ResponseEntity.ok(tools);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Tool> getById(@PathVariable Long id) {
        Tool tool = toolService.getToolById(id);
        if(tool == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(tool);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/")
    public ResponseEntity<Tool> save(@RequestBody Tool tool) {
        Tool toolNew = toolService.save(tool);
        return ResponseEntity.ok(toolNew);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/")
    public ResponseEntity<Tool> update(@RequestBody Tool tool) {
        Tool toolNew = toolService.update(tool);
        return ResponseEntity.ok(toolNew);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable Long id) {
        boolean result = toolService.delete(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/top10")
    public ResponseEntity<List<Tool>> getTop10Tools(){
        List<Tool> top10 = toolService.getTop10Tools();
        return ResponseEntity.ok(top10);
    }

    @GetMapping("/{name}")
    public ResponseEntity<List<Tool>> getToolByName(@PathVariable String name){
        List<Tool> stock = toolService.getStockTools(name);
        return ResponseEntity.ok(stock);
    }
}
