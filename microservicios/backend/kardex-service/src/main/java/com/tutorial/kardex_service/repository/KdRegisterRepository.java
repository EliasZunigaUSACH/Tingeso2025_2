package com.tutorial.kardex_service.repository;

import com.tutorial.kardex_service.entity.KdRegister;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.*;

@Repository
public interface KdRegisterRepository extends JpaRepository<KdRegister, Long> {
    public List<KdRegister> findByToolId(Long toolId);

    public List<KdRegister> findByDateBetween(LocalDate startDate, LocalDate endDate);
}
