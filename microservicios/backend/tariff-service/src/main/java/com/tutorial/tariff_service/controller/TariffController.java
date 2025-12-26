package com.tutorial.tariff_service.controller;

import com.tutorial.tariff_service.entity.Tariff;
import com.tutorial.tariff_service.service.TariffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tariff")
public class TariffController {

    @Autowired
    TariffService tariffService;

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/")
    public ResponseEntity<Tariff>  getTariff(){
        Tariff tariff = tariffService.getTariff();
        return ResponseEntity.ok(tariff);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/")
    public ResponseEntity<Tariff> updateTariff(@RequestBody Tariff tariff){
        Tariff updatedTariff = tariffService.updateTariff(tariff);
        return ResponseEntity.ok(updatedTariff);
    }
}
