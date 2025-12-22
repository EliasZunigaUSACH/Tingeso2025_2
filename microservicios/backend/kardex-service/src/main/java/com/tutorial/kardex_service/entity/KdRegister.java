package com.tutorial.kardex_service.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.*;

@Entity
@Table(name = "kdRegisters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KdRegister {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;
    private String movement;
    private int typeRelated; // 1 = tool, 2 = loan
    private Long loanId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    private Long clientId;
    private String clientName;
    private Long toolId;
    private String toolName;
}