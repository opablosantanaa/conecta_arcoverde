package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.dto.request.VagaFiltroRequest;
import com.prefeitura.arcoverde.dto.response.VagaPublicaResponse;
import com.prefeitura.arcoverde.model.Vaga.TipoContrato;
import com.prefeitura.arcoverde.service.VagaPublicaService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vagas/public")
public class VagaPublicaController {

    private final VagaPublicaService vagaPublicaService;

    public VagaPublicaController(VagaPublicaService vagaPublicaService) {
        this.vagaPublicaService = vagaPublicaService;
    }

    @GetMapping
    public Page<VagaPublicaResponse> buscar(
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) Long areaId,
            @RequestParam(required = false) String cidade,
            @RequestParam(required = false) TipoContrato tipoContrato,
            @PageableDefault(size = 20, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {

        VagaFiltroRequest filtro = new VagaFiltroRequest(titulo, areaId, cidade, tipoContrato);
        return vagaPublicaService.buscar(filtro, pageable);
    }

    @GetMapping("/{id}")
    public VagaPublicaResponse buscarPorId(@PathVariable Long id) {
        return vagaPublicaService.buscarPorId(id);
    }
}