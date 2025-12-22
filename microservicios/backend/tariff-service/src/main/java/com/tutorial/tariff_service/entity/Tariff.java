package com.tutorial.tariff_service.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Entity
@Table(name = "tariff")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tariff {
    @Id
    @Column(unique = true, nullable = false)
    private Long id = 1L;
    private Long dailyTariff;
    private Long delayTariff;
}