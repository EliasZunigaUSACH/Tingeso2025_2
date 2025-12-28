package com.tutorial.client_service.controller;

import com.tutorial.client_service.entity.Client;
import com.tutorial.client_service.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    ClientService clientService;

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/")
    public ResponseEntity<List<Client>> getAll() {
        List<Client> clients = clientService.getAll();
        return ResponseEntity.ok(clients);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Client> getById(@PathVariable Long id) {
        Client client = clientService.getClientById(id);
        return ResponseEntity.ok(client);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PostMapping("/")
    public ResponseEntity<Client> save(@RequestBody Client client) {
        Client clientNew = clientService.save(client);
        return ResponseEntity.ok(clientNew);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PutMapping("/update")
    public ResponseEntity<Client> update(@RequestBody Client client) {
        Client clientNew = clientService.updateClient(client);
        return ResponseEntity.ok(clientNew);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable Long id) {
        boolean result = clientService.delete(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/search/withActiveDelayedLoans")
    public ResponseEntity<List<Client>> getWithActiveDelayedLoans(){
        List<Client> clients = clientService.getClientsWithDelayedLoans();
        return ResponseEntity.ok(clients);
    }
}
