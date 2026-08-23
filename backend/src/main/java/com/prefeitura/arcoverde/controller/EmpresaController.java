package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.dto.response.EmpresaResponse;
import com.prefeitura.arcoverde.service.EmpresaService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    private final EmpresaService empresaService;

    public EmpresaController(EmpresaService empresaService) {
        this.empresaService = empresaService;
    }

    @GetMapping
    public List<EmpresaResponse> listarTodas() {
        return empresaService.listarTodas();
    }

    @GetMapping("/paginado")
    public Page<EmpresaResponse> listarPaginado(
            @PageableDefault(size = 20, sort = "nomeFantasia", direction = Sort.Direction.ASC) Pageable pageable) {
        return empresaService.listarPaginado(pageable);
    }

    @GetMapping("/{id}")
    public EmpresaResponse buscarPorId(@PathVariable Long id) {
        return empresaService.buscarPorId(id);
    }
}