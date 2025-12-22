package com.tutorial.tool_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Loan {
    private Long id;
    private Long clientId;
    private String clientName;
    private Long ToolId;
    private String toolName;
    private String dateStart;
    private String dateLimit;
    private String dateReturn;
    private Long tariffPerDay;
    private Long totalTariff;
    private Long delayTariff;
    private Long delayFine;
    private boolean isActive;
    private boolean isDelayed;
    private boolean toolGotDamaged;
}
