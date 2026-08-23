package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.dto.response.IndicadoresResponse;
import com.prefeitura.arcoverde.service.IndicadorService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/prefeitura/indicadores")
public class IndicadorController {

    private final IndicadorService indicadorService;

    public IndicadorController(IndicadorService indicadorService) {
        this.indicadorService = indicadorService;
    }

    @GetMapping
    public IndicadoresResponse obter() {
        return indicadorService.obterIndicadores();
    }
}