package com.tutorial.kardex_service.service;

import com.tutorial.kardex_service.entity.KdRegister;
import com.tutorial.kardex_service.model.Loan;
import com.tutorial.kardex_service.model.Tool;
import com.tutorial.kardex_service.repository.KdRegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.*;
import java.time.format.*;
import java.util.*;

@Service
public class KdRegisterService {

    @Autowired
    KdRegisterRepository kdRegisterRepository;

    @Autowired
    RestTemplate restTemplate;

    public List<KdRegister> getAll() {
        return kdRegisterRepository.findAll();
    }

    public void create(String movement, int type, Long ID){
        KdRegister newRegister = new KdRegister();
        newRegister.setMovement(movement);
        newRegister.setDate(LocalDate.now());
        switch (type) {
            case 1:
                newRegister.setTypeRelated(1);
                newRegister.setToolId(ID);
                Tool tool = restTemplate.getForObject("http://tool-service/tools/" + ID, Tool.class);
                newRegister.setToolName(tool.getName());
                break;
            case 2:
                newRegister.setTypeRelated(2);
                newRegister.setLoanId(ID);
                Loan loan = restTemplate.getForObject("http://loan-service/loans/" + ID, Loan.class);
                newRegister.setClientId(loan.getClientId());
                newRegister.setClientName(loan.getClientName());
                newRegister.setToolId(loan.getToolId());
                newRegister.setToolName(loan.getToolName());
                break;
        }
        kdRegisterRepository.save(newRegister);
    }

    public List<KdRegister> getByTool(Long toolId) {
        return kdRegisterRepository.findByToolId(toolId);
    }

    public List<KdRegister> getByDateRange(String startDate, String endDate) {
        LocalDate start, end;
        if (startDate.isEmpty()) start = LocalDate.of(0, Month.JANUARY, 1);
        else start = LocalDate.parse(startDate);

        if (endDate.isEmpty()) end = LocalDate.of(9999, Month.DECEMBER, 31);
        else end = LocalDate.parse(endDate);

        return kdRegisterRepository.findByDateBetween(start, end);
    }

    public boolean delete(Long id) throws Exception{
        try {
            kdRegisterRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }
}
