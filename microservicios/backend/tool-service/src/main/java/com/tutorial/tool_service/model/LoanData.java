package com.tutorial.tool_service.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanData {
    private Long loanID;          // ID del préstamo
    private String loanDate;      // Fecha de préstamo
    private String dueDate;       // Fecha límite
    private String clientName;    // Nombre del cliente
    private String toolName;      // Nombre de la herramienta
    private Long dataToolId;      // ID de la herramienta
    private String returnDate;    // Fecha devolución
    private String status;        // Estado del préstamo (vigente o atrasado)
}
