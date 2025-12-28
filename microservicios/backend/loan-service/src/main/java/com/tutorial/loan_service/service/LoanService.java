package com.tutorial.loan_service.service;

import com.tutorial.loan_service.entity.Loan;
import com.tutorial.loan_service.model.*;
import com.tutorial.loan_service.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class LoanService {

    @Autowired
    LoanRepository loanRepository;

    @Autowired
    RestTemplate restTemplate;

    @Autowired
    public void setRestTemplate(RestTemplate restTemplate) {
        restTemplate.getInterceptors().add((request, body, execution) -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication instanceof JwtAuthenticationToken jwtAuthenticationToken) {
                request.getHeaders().setBearerAuth(jwtAuthenticationToken.getToken().getTokenValue());
            }
            return execution.execute(request, body);
        });
        this.restTemplate = restTemplate;
    }

    public List<Loan> getAll() {
        return loanRepository.findAll();
    }

    public Loan getToolById(Long id) {
        return loanRepository.findById(id).get();
    }

    public Loan save(Loan loan) throws ResponseStatusException {
        Client client = getClient(loan.getClientId());
        Tool tool = getTool(loan.getToolId());
        checkClientAndTool(client, tool);
        loan.setToolName(tool.getName());

        Tariff tariff = restTemplate.getForObject("http://tariff-service/api/tariff/", Tariff.class);
        loan.setTariffPerDay(tariff.getDailyTariff());
        loan.setTotalTariff(0L);
        loan.setDelayTariff(tariff.getDelayTariff());
        loan.setDelayFine(0L);

        Loan savedLoan = loanRepository.save(loan);

        // Agregar datos del préstamo a la
        LoanData data = createData(savedLoan, "Vigente");
        List<LoanData> loanList = client.getLoans();
        loanList.add(data);
        client.setLoans(loanList);
        registerLoanMovement(savedLoan, client, tool, "Prestamo");
        updateClient(client);

        LocalDate now = LocalDate.now();
        String nowString = now.toString().split("T")[0];
        if (nowString.equals(savedLoan.getDateStart())) {
            tool.setStatus(2);
            updateTool(tool);
        }

        registerLoanMovement(savedLoan, client, tool, "Prestamo");
        return savedLoan;
    }

    public Loan update(Loan loan) {
        if (!loan.isActive()){
            // Eliminar prestamo de la lista de prestamos activos del cliente
            Client client = getClient(loan.getClientId());
            List<LoanData> clientLoans = client.getLoans();
            deleteLoanData(clientLoans, loan.getId());
            client.setLoans(clientLoans);

            // Calcular multa por atraso si es necesario
            if (loan.isDelayed()){
                Long daysLate = calculateDaysDiff(loan.getDateLimit(), loan.getDateReturn());
                Long fine = calculateFine(daysLate, loan.getTariffPerDay());
                loan.setDelayFine(fine);
                client.setFine(client.getFine() + fine);
            }

            updateClient(client);

            Loan updateLoan = loanRepository.save(loan);

            // Actualizar herramienta
            Tool tool = getTool(loan.getToolId());
            List<LoanData> toolHistory = tool.getHistory();
            LoanData updatedLoanData = createData(updateLoan, "Devuelto");
            toolHistory.add(updatedLoanData);
            tool.setHistory(toolHistory);
            if (updateLoan.isToolGotDamaged()) tool.setStatus(1);
            else tool.setStatus(3);
            updateTool(tool);

            // Registrar movimiento en kardex
            registerLoanMovement(loan, client, tool, "Devolución");

            return updateLoan;

        } else {
            return loanRepository.save(loan);
        }
    }

    public boolean delete(Long id) throws Exception {
        try {
            Loan loan = loanRepository.findById(id).get();
            if (loan.isActive()) {
                Client client = getClient(loan.getClientId());
                List<LoanData> clientLoans = client.getLoans();
                deleteLoanData(clientLoans, id);
                client.setLoans(clientLoans);
                updateClient(client);
            }
            loanRepository.delete(loan);
            return true;
        } catch (Exception e) {
            throw new Exception("Error al eliminar el prestamo: " + e.getMessage(), e);
        }
    }

    private Client getClient(Long clientId) {
        return restTemplate.getForObject("http://client-service/api/clients/" + clientId, Client.class);
    }

    private Tool getTool(Long toolId) {
        return restTemplate.getForObject("http://tool-service/api/tools/" + toolId, Tool.class);
    }

    public void updateTool(Tool tool){
        restTemplate.put("http://tool-service/api/tools/update", tool);
    }

    public void updateClient(Client client){
        restTemplate.put("http://client-service/api/clients/update", client);
    }

    private Long calculateDaysDiff(String dateLimit, String dateReturn) {
        dateReturn = dateReturn.split("T")[0];
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate startDate = LocalDate.parse(dateLimit, formatter);
        LocalDate endDate = LocalDate.parse(dateReturn, formatter);
        return ChronoUnit.DAYS.between(startDate, endDate);
    }

    private Long calculateFine(Long daysLate, Long price) {
        return daysLate * price;
    }


    private void checkClientAndTool(Client client, Tool tool) throws ResponseStatusException {
        if (client.isRestricted()) { // Cliente restringido
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "El cliente" + client.getName() + " está restringido");
        } else if (client.getLoans().size() == 5) { // Cliente con 5 prestamos activos
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El cliente " + client.getName() + " tiene 5 prestamos vigentes.");
        } else if (isSameTool(client, tool.getId())) { // Cliente ya tiene esta herramienta prestada
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El cliente " + client.getName() + " ya tiene prestada esta herramienta.");
        } else if (calcStock(tool.getName()) > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No hay stock disponible de la herramienta " + tool.getName() + ".");
        }
        switch(tool.getStatus()) {
            case 0:
                throw new ResponseStatusException(HttpStatus.GONE, "La herramienta " + tool.getName() + " fué dada de baja.");
            case 1:
                throw new ResponseStatusException(HttpStatus.LOCKED, "La herramienta " + tool.getName() + " está en reparación.");
            case 2:
                throw new ResponseStatusException(HttpStatus.CONFLICT, "La herramienta " + tool.getName() + " ya está prestada.");
            case 3:
                break;
        }
    }

    public List<Loan> getActiveLoans() {
        return loanRepository.findByIsActiveTrueAndIsDelayedTrue();
    }

    public List<Loan> getDelayedLoans() {
        return loanRepository.findByIsActiveTrueAndIsDelayedFalse();
    }

    public List<Loan> getLoansFromClient(Long clientId){
        return loanRepository.findByClientIdAndIsActiveTrue(clientId);
    }

    private int calcStock(String toolName){
        List<Tool> toolStock = restTemplate.getForObject("http://tool-service/api/tools/name/" + toolName, List.class);
        if (toolStock != null) return toolStock.size();
        else return 0;
    }

    private boolean isSameTool(Client client, Long toolId) {
        Tool tool = getTool(toolId);
        for (LoanData loanData : client.getLoans()) {
            Loan loan = loanRepository.findById(loanData.getLoanID()).get();
            if (tool.getName().equals(loan.getToolName()) && (!toolId.equals(loan.getToolId()))) {
                return true;
            }
        }
        return false;
    }

    @Transactional
    @EventListener(ApplicationReadyEvent.class)
    @Scheduled(cron = "0 0 0 * * *")
    public void updateActiveLoans(){ // Metodo automatico llamado cada dia a las 00:00:00 o cuando bakcend inicia
        LocalDate now = LocalDate.now();
        List<Loan> loans = loanRepository.findByIsActiveTrueAndIsDelayedFalse(); // Obtener los prestamos activos
        for (Loan loan : loans){
            LocalDate limit = LocalDate.parse(loan.getDateLimit());
            LocalDate start = LocalDate.parse(loan.getDateStart());
            if(now.isAfter(limit)){ // Si el prestamo ha pasado su fecha de límite
                loan.setDelayed(true); // Se marca como atrasado
                Client client = getClient(loan.getClientId());
                client.setRestricted(true);
                List<LoanData> clientLoans = client.getLoans();
                deleteLoanData(clientLoans, loan.getId());
                LoanData data = createData(loan, "Atrasado");
                clientLoans.add(data);
                client.setLoans(clientLoans);
                updateClient(client);
            } else if (now.isEqual(limit) || (now.isBefore(limit) && now.isAfter(start))) { // Si el prestamo esta en su periodo activo
                Long actualTotal = loan.getTotalTariff();
                loan.setTotalTariff(actualTotal + loan.getTariffPerDay()); // Se actualiza la tarifa total
            }
            loanRepository.save(loan);
        }
    }

    private LoanData createData(Loan loan, String status){
        LoanData data = new LoanData();
        data.setLoanID(loan.getId());
        data.setLoanDate(loan.getDateStart());
        data.setDueDate(loan.getDateLimit());
        data.setClientName(loan.getClientName());
        data.setToolName(loan.getToolName());
        data.setDataToolId(loan.getToolId());
        if (loan.getDateReturn() != null && !loan.getDateReturn().isEmpty()) {
            data.setReturnDate(loan.getDateReturn());
        }
        data.setStatus(status);
        return data;
    }

    private void deleteLoanData(List<LoanData> loanDataList, Long id){
        Iterator<LoanData> iterator = loanDataList.iterator();
        while (iterator.hasNext()) {
            LoanData loanData = iterator.next();
            if (loanData.getLoanID().equals(id)) {
                iterator.remove();
                break;
            }
        }
    }

    private void registerLoanMovement(Loan loan, Client client, Tool tool, String movement){
        KdRegister newRegister = new KdRegister();
        newRegister.setToolId(tool.getId());
        newRegister.setToolName(tool.getName());
        newRegister.setMovement(movement);
        newRegister.setTypeRelated(2);
        LocalDate date = LocalDate.now();
        newRegister.setDate(date);
        newRegister.setClientId(client.getId());
        newRegister.setClientName(client.getName());
        newRegister.setLoanId(loan.getId());
        restTemplate.postForObject("http://kardex-service/api/kardex/", newRegister, Void.class);
    }
}
