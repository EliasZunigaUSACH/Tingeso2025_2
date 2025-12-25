package com.tutorial.loan_service.controller;

import com.tutorial.loan_service.entity.Loan;
import com.tutorial.loan_service.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin("*")
public class LoanController {

    @Autowired
    LoanService loanService;

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/")
    public ResponseEntity<List<Loan>> getAll() {
        List<Loan> loans = loanService.getAll();
        if(loans.isEmpty())
            return ResponseEntity.noContent().build();
        return ResponseEntity.ok(loans);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Loan> getById(@PathVariable Long id) {
        Loan loan = loanService.getToolById(id);
        if(loan == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(loan);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PostMapping("/")
    public ResponseEntity<Loan> save(@RequestBody Loan loan) {
        Loan loanNew = loanService.save(loan);
        return ResponseEntity.ok(loanNew);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PutMapping("/")
    public ResponseEntity<Loan> update(@RequestBody Loan loan) {
        Loan loanNew = loanService.update(loan);
        return ResponseEntity.ok(loanNew);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable Long id) throws Exception {
        var result = loanService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/actives")
    public ResponseEntity<List<Loan>> getActiveLoans() {
        List<Loan> loans = loanService.getActiveLoans();
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/delayed")
    public ResponseEntity<List<Loan>> getDelayedLoans() {
        List<Loan> loans = loanService.getDelayedLoans();
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/activesForClient/{id}")
    public ResponseEntity<List<Loan>> getActiveLoansFromClient(@PathVariable Long id){
        List<Loan> clientLoans = loanService.getLoansFromClient(id);
        return ResponseEntity.ok(clientLoans);
    }
}
