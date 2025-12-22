package com.tutorial.client_service.entity;

import com.tutorial.client_service.model.LoanData;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String rut;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean isRestricted;

    @ElementCollection
    @CollectionTable(name = "client_loans", joinColumns = @JoinColumn(name = "client_id"))
    @Column(name = "loans", nullable = false)
    private List<LoanData> loans = new ArrayList<>();

    @Column(nullable = false)
    private Long fine;
}