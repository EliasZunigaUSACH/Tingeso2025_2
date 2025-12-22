package com.tutorial.tool_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    private Long id;
    private String name;
    private String phone;
    private String rut;
    private String email;
    private boolean isRestricted;
    private List<LoanData> loans;
    private Long fine;
}
