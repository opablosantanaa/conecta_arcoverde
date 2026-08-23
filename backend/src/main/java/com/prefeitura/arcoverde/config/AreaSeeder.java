package com.prefeitura.arcoverde.config;

import com.prefeitura.arcoverde.model.Area;
import com.prefeitura.arcoverde.repository.AreaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@Order(2)
public class AreaSeeder implements CommandLineRunner {

    private final AreaRepository areaRepository;

    public AreaSeeder(AreaRepository areaRepository) {
        this.areaRepository = areaRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (areaRepository.count() > 0) return;

        List<String> areas = List.of(
                "Administrativo",
                "Comércio e Vendas",
                "Tecnologia da Informação",
                "Saúde",
                "Educação",
                "Indústria e Produção",
                "Logística e Transporte",
                "Construção Civil",
                "Alimentação e Hotelaria",
                "Serviços Gerais",
                "Agronegócio",
                "Beleza e Estética",
                "Comunicação e Marketing",
                "Financeiro e Contábil",
                "Jurídico"
        );

        for (String nome : areas) {
            areaRepository.save(Area.builder().nome(nome).build());
        }
    }
}