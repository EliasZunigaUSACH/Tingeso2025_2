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
import java.util.List;

@Service
public class ClientService {

    @Autowired
    ClientRepository clientRepository;

    @Autowired
    RestTemplate restTemplate;

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
        for (Client client : clients) {
            int delayedCount = countDelayedLoans(client);
            if (delayedCount == 0) clients.remove(client);
        }
        return clients;
    }

    private boolean detectDelayedLoans(Client client) {
        Long clientID = client.getId();
        List<Loan> clientLoans = getActiveLoansFromClient(clientID);
        for (Loan loan : clientLoans) {
            if (loan.isDelayed()) {
                return true;
            }
        }
        return false;
    }

    private int countDelayedLoans(Client client) {
        List<LoanData> dataList = client.getLoans();
        int count = 0;
        for (LoanData loanData : dataList) {
            Loan loan = getLoan(loanData.getLoanID());
            if (loan.isDelayed()) {
                count++;
            }
        }
        return count;
    }

    public Loan getLoan(Long id){
        return restTemplate.getForObject("http://loan-service/loans/" + id, Loan.class);
    }

    public List<Loan> getActiveLoansFromClient(Long clientID){
        return restTemplate.getForObject("http://loan-service/loans/activesForClient/" + clientID, List.class);
    }
}
