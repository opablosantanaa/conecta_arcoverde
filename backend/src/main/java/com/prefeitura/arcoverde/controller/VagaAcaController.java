package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.dto.request.AprovacaoVagaRequest;
import com.prefeitura.arcoverde.dto.request.VagaRequest;
import com.prefeitura.arcoverde.dto.response.VagaResponse;
import com.prefeitura.arcoverde.model.Vaga;
import com.prefeitura.arcoverde.service.VagaService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/aca/vagas")
public class VagaAcaController {

    private final VagaService vagaService;

    public VagaAcaController(VagaService vagaService) {
        this.vagaService = vagaService;
    }

    @GetMapping
    public Page<VagaResponse> listarTodas(
            @PageableDefault(size = 20, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return vagaService.listarTodas(pageable);
    }

    @GetMapping("/estado/{estado}")
    public Page<VagaResponse> listarPorEstado(
            @PathVariable Vaga.EstadoVaga estado,
            @PageableDefault(size = 20, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return vagaService.listarPorEstado(estado, pageable);
    }

    @GetMapping("/{id}")
    public VagaResponse buscarPorId(@PathVariable Long id) {
        return vagaService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<VagaResponse> criar(
            @Valid @RequestBody VagaRequest request,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(vagaService.criar(request, httpRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VagaResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody VagaRequest request,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(vagaService.atualizar(id, request, httpRequest));
    }

    @PostMapping("/{id}/moderar")
    public ResponseEntity<VagaResponse> aprovarOuRejeitar(
            @PathVariable Long id,
            @Valid @RequestBody AprovacaoVagaRequest request,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(vagaService.aprovarOuRejeitar(id, request, httpRequest));
    }

    @PostMapping("/{id}/publicar")
    public ResponseEntity<VagaResponse> publicar(@PathVariable Long id, HttpServletRequest httpRequest) {
        return ResponseEntity.ok(vagaService.publicar(id, httpRequest));
    }

    @PostMapping("/{id}/encerrar")
    public ResponseEntity<VagaResponse> encerrar(@PathVariable Long id, HttpServletRequest httpRequest) {
        return ResponseEntity.ok(vagaService.encerrar(id, httpRequest));
    }

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<VagaResponse> cancelar(@PathVariable Long id, HttpServletRequest httpRequest) {
        return ResponseEntity.ok(vagaService.cancelar(id, httpRequest));
    }
}