package com.tutorial.client_service.service;

import com.tutorial.client_service.entity.Client;
import com.tutorial.client_service.model.Loan;
import com.tutorial.client_service.model.LoanData;
import com.tutorial.client_service.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class ClientService {

    @Autowired
    ClientRepository clientRepository;

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

    public List<Client> getAll() {
        return clientRepository.findAll();
    }

    public Client getClientById(Long id) {
        return clientRepository.findById(id).get();
    }

    public Client save(Client client) {
        return clientRepository.save(client);
    }

    public Client updateClient(Client client) {
        client.setRestricted((client.getFine() > 0L) || (detectDelayedLoans(client)));
        return clientRepository.save(client);
    }

    public boolean delete(Long id) {
        Client client = getClientById(id);
        if (client.getLoans().isEmpty()) {
            clientRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    public List<Client> getClientsWithDelayedLoans(){
        List<Client> clients = clientRepository.findByLoansNotEmpty();
        clients.removeIf(client -> !detectDelayedLoans(client));
        if (clients.isEmpty()) return new ArrayList<>();
        else return clients;
    }

    private boolean detectDelayedLoans(Client client) {
        if (client.getLoans().isEmpty()) return false;
        Long clientID = client.getId();
        List<Loan> clientLoans = getActiveLoansFromClient(clientID);
        for (Loan loan : clientLoans) {
            if (loan.isDelayed()) {
                return true;
            }
        }
        return false;
    }

    public List<Loan> getActiveLoansFromClient(Long clientID){
        Loan[] loansArray = restTemplate.getForObject("http://loan-service/api/loans/activesForClient/" + clientID, Loan[].class);
        return Arrays.asList(loansArray);
    }
}
