package com.tutorial.report_service.service;

import com.tutorial.report_service.entity.Report;
import com.tutorial.report_service.model.*;
import com.tutorial.report_service.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;

@Service
public class ReportService {

    @Autowired
    ReportRepository reportRepository;

    @Autowired
    private RestTemplate restTemplate;

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

    public List<Report> getAll() {
        return reportRepository.findAll();
    }

    public Report getById(Long id) {
        return reportRepository.findById(id).get();
    }

    String loan_url = "http://loan-service/api/loans/";
    String client_url = "http://client-service/api/clients/";
    String tool_url = "http://tool-service/api/tools/";

    public Report save(Report report) {
        Loan[] activesArray, delayedArray;
        Tool[] toolsArray = restTemplate.getForObject( tool_url + "top10", Tool[].class);
        activesArray = restTemplate.getForObject( loan_url + "/search/actives", Loan[].class);
        delayedArray = restTemplate.getForObject( loan_url + "/search/delayed", Loan[].class);
        if (toolsArray == null) report.setTopTools(new ArrayList<>());
        else report.setTopTools(getTopString(Arrays.asList(toolsArray)));
        if (activesArray == null) report.setActiveLoans(new ArrayList<>());
        else report.setActiveLoans(trasnferToData(Arrays.asList(activesArray)));
        if (delayedArray == null) report.setDelayedLoans(new ArrayList<>());
        else report.setDelayedLoans(trasnferToData(Arrays.asList(delayedArray)));
        report.setClientsWithDelayedLoans(getClientsWithDelayedLoansCall());
        return reportRepository.save(report);
    }

    public boolean delete(Long id) throws Exception{
        try{
            reportRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public List<Report> getReportsByDateRange(String startDate, String endDate){
        LocalDate start, end;
        if (startDate == null || startDate.isEmpty()) start = LocalDate.MIN;
        else start = LocalDate.parse(startDate);

        if (endDate == null || endDate.isEmpty()) end = LocalDate.MAX;
        else end = LocalDate.parse(endDate);

        return reportRepository.findByCreationDateBetween(start.toString(), end.toString());
    }

    private List<LoanData> trasnferToData(List<Loan> loans) {
        List<LoanData> loanDataList = new ArrayList<>();
        for (Loan loan : loans) {
            LoanData loanData = new LoanData();
            loanData.setLoanID(loan.getId());
            loanData.setClientName(loan.getClientName());
            loanData.setToolName(loan.getToolName());
            loanData.setLoanDate(loan.getDateStart());
            loanData.setDueDate(loan.getDateLimit());
            loanData.setDataToolId(loan.getToolId());
            loanDataList.add(loanData);
        }
        return loanDataList;
    }

    private List<String> getTopString(List<Tool> tools){
        List<String> top10String = new ArrayList<>();
        for (Tool tool : tools) {
            top10String.add(tool.getName() + " (" + tool.getId() + ")" + " - " + tool.getHistory().size() + " préstamos");
        }
        return top10String;
    }

    private List<String> getClientsWithDelayedLoansCall(){
        Client[] clientsArray = restTemplate.getForObject(client_url + "/search/withActiveDelayedLoans", Client[].class);
        if (clientsArray == null) return new ArrayList<>();
        List<Client> clients = Arrays.asList(clientsArray);
        List<String> clientsNames = new ArrayList<>();
        for (Client client : clients) {
            int delayedCount = countDelayedLoans(client);
            if (delayedCount > 0) {
                clientsNames.add(
                        client.getName() + " con " + delayedCount + " préstamos retrasados"
                );
            }
        }
        return clientsNames;
    }

    private int countDelayedLoans(Client client) {
        List<LoanData> clientLoans = client.getLoans();
        if (!clientLoans.isEmpty())  {
            int count = 0;
            for (LoanData loanData : clientLoans) {
                if (loanData.getStatus().equals("Atrasado")) count++;
            }
            return count;
        }
        return 0;
    }
}