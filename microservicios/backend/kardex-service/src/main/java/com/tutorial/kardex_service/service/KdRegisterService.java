package com.tutorial.kardex_service.service;

import com.tutorial.kardex_service.entity.KdRegister;
import com.tutorial.kardex_service.repository.KdRegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.*;
import java.util.*;

@Service
public class KdRegisterService {

    @Autowired
    KdRegisterRepository kdRegisterRepository;

    public List<KdRegister> getAll() {
        return kdRegisterRepository.findAll();
    }

    public KdRegister save(KdRegister newRegister){
        return kdRegisterRepository.save(newRegister);
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
