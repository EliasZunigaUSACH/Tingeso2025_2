package com.tutorial.loan_service.service;

import com.tutorial.loan_service.entity.Loan;
import com.tutorial.loan_service.model.*;
import com.tutorial.loan_service.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
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

        restTemplate.postForObject("http://kardex-service/kardex/createLoanRecord/" + client.getId() + "/" + tool.getId(), null, Void.class);
        return loanRepository.save(loan);
    }

    public Loan update(Loan loan) {
        return loanRepository.save(loan);
    }

    public boolean delete(Long id) {
        loanRepository.deleteById(id);
        return true;
    }

    private Client getClient(Long clientId) {
        return restTemplate.getForObject("http://client-service/clients/" + clientId, Client.class);
    }

    private Tool getTool(Long toolId) {
        return restTemplate.getForObject("http://tool-service/tools/" + toolId, Tool.class);
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
        return loanRepository.findByClientId(clientId);
    }

    private int calcStock(String toolName){
        List<Tool> toolStock = restTemplate.getForObject("http://tool-service/tools/" + toolName, List.class);
        return toolStock.size();
    }

    private boolean isSameTool(Client client, Long toolId) {
        Tool tool = restTemplate.getForObject("http://tool-service/tools/" + toolId, Tool.class);
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
                Client client = restTemplate.getForObject("http://client-service/clients/" + loan.getClientId(), Client.class);
                client.setRestricted(true);
                List<LoanData> clientLoans = client.getLoans();
                deleteLoanData(clientLoans, loan.getId());
                LoanData data = createData(loan, "Atrasado");
                clientLoans.add(data);
                client.setLoans(clientLoans);
                restTemplate.put("http://client-service/clients/" + loan.getClientId(), client);
            } else if (now.isEqual(limit) || (now.isBefore(limit) && now.isAfter(start))) { // Si el prestamo esta en su periodo activo
                Long actualTotal = loan.getTotalTariff();
                loan.setTotalTariff(actualTotal + loan.getTariffPerDay()); // Se actualiza la tarifa total
            }
            restTemplate.put("http://loan-service/loans/" + loan.getId(), loan);
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
}
