package com.tutorial.report_service.repository;

import com.tutorial.report_service.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    public List<Report> findByCreationDateBetween(String creationDate, String creationDate2);
}
