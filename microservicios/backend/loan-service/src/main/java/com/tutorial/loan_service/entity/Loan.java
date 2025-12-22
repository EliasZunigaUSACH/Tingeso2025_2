package com.tutorial.loan_service.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Entity
@Table(name = "loans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @Column(nullable = false)
    private Long clientId;
    private String clientName;

    @Column(nullable = false)
    private Long ToolId;
    private String toolName;

    private String dateStart;
    private String dateLimit;
    private String dateReturn;

    private Long tariffPerDay;
    private Long totalTariff;
    private Long delayTariff;
    private Long delayFine;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean isActive;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean isDelayed;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean toolGotDamaged;
}