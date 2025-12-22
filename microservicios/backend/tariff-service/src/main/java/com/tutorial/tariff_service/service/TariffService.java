package com.tutorial.tariff_service.service;

import com.tutorial.tariff_service.entity.Tariff;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import com.tutorial.tariff_service.repository.TariffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TariffService {

    @Autowired
    TariffRepository tariffRepository;

    public Tariff getTariff(){
        return tariffRepository.findById(1L)
                .orElseGet(this::createAndSaveDefaultTariff);
    }

    public Tariff createAndSaveDefaultTariff() {
        Tariff newTariff = createTariff();
        return tariffRepository.save(newTariff);
    }

    public Tariff updateTariff(Tariff tariff){
        return tariffRepository.save(tariff);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void checkTariff(){
        if (tariffRepository.count() == 0){
            Tariff tariff = createTariff();
            tariffRepository.save(tariff);
        }
    }

    public Tariff createTariff(){
        Tariff newTariff = new Tariff();
        newTariff.setId(1L);
        newTariff.setDailyTariff(1000L);
        newTariff.setDelayTariff(2000L);
        return newTariff;
    }
}