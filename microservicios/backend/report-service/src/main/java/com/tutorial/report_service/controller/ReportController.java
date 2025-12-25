package com.tutorial.report_service.controller;

import com.tutorial.report_service.entity.Report;
import com.tutorial.report_service.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin("*")
public class ReportController {

    @Autowired
    ReportService reportService;

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/")
    public ResponseEntity<List<Report>> getAll() {
        List<Report> reports = reportService.getAll();
        if(reports.isEmpty())
            return ResponseEntity.noContent().build();
        return ResponseEntity.ok(reports);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Report> getById(@PathVariable Long id) {
        Report report = reportService.getById(id);
        if(report == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(report);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PostMapping("/")
    public ResponseEntity<Report> save(@RequestBody Report report) {
        Report reportNew = reportService.save(report);
        return ResponseEntity.ok(reportNew);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Report> delete(@PathVariable Long id) throws Exception{
        var isDeleted = reportService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/dateRange")
    public ResponseEntity<List<Report>> getReportsByDateRange(@RequestParam(required = false) String startDate,
                                                              @RequestParam(required = false) String endDate) {
        List<Report> reports = reportService.getReportsByDateRange(startDate, endDate);
        return ResponseEntity.ok(reports);
    }
}
