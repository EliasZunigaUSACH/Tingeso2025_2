package com.tutorial.tool_service.service;

import com.tutorial.tool_service.entity.Tool;
import com.tutorial.tool_service.model.*;
import com.tutorial.tool_service.repository.ToolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ToolService {

    @Autowired
    ToolRepository toolRepository;

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

    String kardex_url = "http://kardex-service/api/kardex/";
    String loan_url = "http://loan-service/api/loans/";
    String client_url = "http://client-service/api/clients/";

    public List<Tool> getAll() {
        return toolRepository.findAll();
    }

    public Tool getToolById(Long id) {
        return toolRepository.findById(id).orElse(null);
    }

    public Tool save(Tool tool) {
        ArrayList<LoanData> Loans = new ArrayList<>();
        tool.setHistory(Loans);
        registerToolMovement(tool, "Registro de herramienta");
        return toolRepository.save(tool);
    }

    public Tool update(Tool tool) {
        Tool oldTool = toolRepository.findById(tool.getId()).get();
        Tool savedTool = toolRepository.save(tool);
        if (savedTool.getStatus() == 0) downTool(oldTool);
        else if ((savedTool.getStatus() == 3) && (oldTool.getStatus() == 2)) registerToolMovement(savedTool, "Alta de herramienta");
        else registerToolMovement(savedTool, "Actualización de herramienta");
        return savedTool;
    }

    public boolean delete(Long id) {
        toolRepository.deleteById(id);
        return true;
    }

    private void downTool(Tool t){
        List<LoanData> history = t.getHistory();
        if (!history.isEmpty()){
            Long lastId = history.get(history.size() - 1).getLoanID();
            Loan loan = restTemplate.getForObject(loan_url + lastId, Loan.class);
            Client client = restTemplate.getForObject(client_url + loan.getClientId(), Client.class);
            client.setFine(client.getFine() + t.getPrice());
            client.setRestricted(true);
            restTemplate.put(client_url + loan.getClientId(), client);
        }
        registerToolMovement(t, "Baja de herramienta");
    }

    public List<Tool> getTop10Tools(){
        List<Tool> tools = toolRepository.findAll();
        List<Tool> top10 = new ArrayList<>();
        tools.sort((t1, t2) -> Integer.compare(t2.getHistory().size(), t1.getHistory().size()));
        for (int i = 0; i < 10; i++) {
            if(i < tools.size()){
                top10.add(tools.get(i));
            }
        }
        return top10;
    }

    private void registerToolMovement(Tool tool, String message){
        KdRegister newRegister = new KdRegister();
        newRegister.setToolId(tool.getId());
        newRegister.setToolName(tool.getName());
        newRegister.setMovement(message);
        newRegister.setTypeRelated(1);
        LocalDate date = LocalDate.now();
        newRegister.setDate(date);
        newRegister.setClientId(null);
        newRegister.setClientName(null);
        newRegister.setLoanId(null);
        restTemplate.postForObject(kardex_url, newRegister, Void.class);
    }

    public List<Tool> getStockTools(String Name){
        return toolRepository.findByNameAndStatus(Name, 3);
    }
}
