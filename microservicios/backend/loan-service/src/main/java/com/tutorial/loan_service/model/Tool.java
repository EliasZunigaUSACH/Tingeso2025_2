package com.tutorial.loan_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tool {
    private Long id;
    private String name;
    private String category;
    private int status; // 0 = down, 1 = on repair, 2 = loaned, 3 = available
    private List<LoanData> history;
    private Long price;
}
