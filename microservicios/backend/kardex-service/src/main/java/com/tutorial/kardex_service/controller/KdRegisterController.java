package com.tutorial.kardex_service.controller;

import com.tutorial.kardex_service.entity.KdRegister;
import com.tutorial.kardex_service.service.KdRegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/kdRegisters")
@CrossOrigin("*")
public class KdRegisterController {

    @Autowired
    KdRegisterService kdRegisterService;

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping
    public ResponseEntity<List<KdRegister>> getAll() {
        List<KdRegister> kdRegisters = kdRegisterService.getAll();
        if(kdRegisters.isEmpty())
            return ResponseEntity.noContent().build();
        return ResponseEntity.ok(kdRegisters);
    }

    @PostMapping
    public ResponseEntity<KdRegister> create(@RequestBody KdRegister kdRegister) {
        KdRegister newRegister = kdRegisterService.save(kdRegister);
        return ResponseEntity.ok(newRegister);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/dateRange")
    public ResponseEntity<List<KdRegister>> getByDateRange(@RequestParam(required = false) String startDate,
                                                           @RequestParam(required = false) String endDate) {
        List<KdRegister> registers = kdRegisterService.getByDateRange(startDate, endDate);
        return ResponseEntity.ok(registers);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/tools/{id}")
    public ResponseEntity<List<KdRegister>> getByTool(@PathVariable Long id) {
        List<KdRegister> toolRegisters = kdRegisterService.getByTool(id);
        return ResponseEntity.ok(toolRegisters);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteRegister(@PathVariable Long id) throws Exception {
        var isDeleted = kdRegisterService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
