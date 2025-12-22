package com.tutorial.tool_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KdRegister {
    private Long id;
    private String movement;
    private int typeRelated; // 1 = tool, 2 = loan
    private Long loanId;
    private LocalDate date;
    private Long clientId;
    private String clientName;
    private Long toolId;
    private String toolName;
}
