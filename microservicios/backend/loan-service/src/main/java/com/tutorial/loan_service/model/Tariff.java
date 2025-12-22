package com.tutorial.loan_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class Tariff {
    private Long id;
    private Long dailyTariff;
    private Long delayTariff;
}