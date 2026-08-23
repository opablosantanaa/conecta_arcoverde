package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.dto.request.RespostaSolicitacaoRequest;
import com.prefeitura.arcoverde.dto.response.SolicitacaoAlteracaoResponse;
import com.prefeitura.arcoverde.service.SolicitacaoAlteracaoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/aca/solicitacoes")
public class SolicitacaoAcaController {

    private final SolicitacaoAlteracaoService solicitacaoService;

    public SolicitacaoAcaController(SolicitacaoAlteracaoService solicitacaoService) {
        this.solicitacaoService = solicitacaoService;
    }

    @GetMapping
    public Page<SolicitacaoAlteracaoResponse> listarTodas(
            @PageableDefault(size = 20, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return solicitacaoService.listarTodas(pageable);
    }

    @GetMapping("/pendentes")
    public Page<SolicitacaoAlteracaoResponse> listarPendentes(
            @PageableDefault(size = 20, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return solicitacaoService.listarPendentes(pageable);
    }

    @GetMapping("/{id}")
    public SolicitacaoAlteracaoResponse buscarPorId(@PathVariable Long id) {
        return solicitacaoService.buscarPorId(id);
    }

    @PostMapping("/{id}/responder")
    public ResponseEntity<SolicitacaoAlteracaoResponse> responder(
            @PathVariable Long id,
            @Valid @RequestBody RespostaSolicitacaoRequest request,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(solicitacaoService.responder(id, request, httpRequest));
    }
}