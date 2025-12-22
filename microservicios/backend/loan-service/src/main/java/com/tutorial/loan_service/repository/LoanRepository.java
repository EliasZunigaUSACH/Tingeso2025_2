package com.tutorial.loan_service.repository;

import com.tutorial.loan_service.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByIsActiveTrueAndIsDelayedTrue();
    List<Loan> findByIsActiveTrueAndIsDelayedFalse();
    List<Loan> findByClientIdAndIsActiveTrue(Long clientId);
}
