package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.dto.request.AtualizarEstadoCandidaturaRequest;
import com.prefeitura.arcoverde.dto.request.SolicitacaoAlteracaoRequest;
import com.prefeitura.arcoverde.dto.request.VagaRequest;
import com.prefeitura.arcoverde.dto.response.CandidaturaEmpresaResponse;
import com.prefeitura.arcoverde.dto.response.SolicitacaoAlteracaoResponse;
import com.prefeitura.arcoverde.dto.response.VagaResponse;
import com.prefeitura.arcoverde.service.PortalEmpresaService;
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
@RequestMapping("/api/empresa")
public class PortalEmpresaController {

    private final PortalEmpresaService portalEmpresaService;
    private final SolicitacaoAlteracaoService solicitacaoService;

    public PortalEmpresaController(PortalEmpresaService portalEmpresaService,
                                   SolicitacaoAlteracaoService solicitacaoService) {
        this.portalEmpresaService = portalEmpresaService;
        this.solicitacaoService = solicitacaoService;
    }

    // ====== VAGAS ======

    @GetMapping("/vagas")
    public Page<VagaResponse> listarMinhasVagas(
            @PageableDefault(size = 20, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return portalEmpresaService.listarMinhasVagas(pageable);
    }

    @GetMapping("/vagas/{id}")
    public VagaResponse buscarMinhaVaga(@PathVariable Long id) {
        return portalEmpresaService.buscarMinhaVaga(id);
    }

    @PutMapping("/vagas/{id}")
    public ResponseEntity<VagaResponse> editarMinhaVaga(
            @PathVariable Long id,
            @Valid @RequestBody VagaRequest request,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(portalEmpresaService.editarMinhaVaga(id, request, httpRequest));
    }

    @PostMapping("/vagas/{id}/encerrar")
    public ResponseEntity<VagaResponse> encerrarSelecao(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(portalEmpresaService.encerrarSelecao(id, httpRequest));
    }

    // ====== CANDIDATOS DA MINHA VAGA (isolamento total) ======

    @GetMapping("/vagas/{id}/candidaturas")
    public Page<CandidaturaEmpresaResponse> listarCandidatosDaVaga(
            @PathVariable Long id,
            @PageableDefault(size = 20, sort = "dataCandidatura", direction = Sort.Direction.DESC) Pageable pageable) {
        return portalEmpresaService.listarCandidatosDaVaga(id, pageable);
    }

    @PutMapping("/vagas/{vagaId}/candidaturas/{candidaturaId}")
    public ResponseEntity<CandidaturaEmpresaResponse> atualizarEstadoCandidatura(
            @PathVariable Long vagaId,
            @PathVariable Long candidaturaId,
            @Valid @RequestBody AtualizarEstadoCandidaturaRequest request,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(
                portalEmpresaService.atualizarEstadoCandidatura(vagaId, candidaturaId, request, httpRequest)
        );
    }

    // ====== SOLICITAÇÕES DE ALTERAÇÃO (após 12h) ======

    @PostMapping("/vagas/{id}/solicitar-alteracao")
    public ResponseEntity<SolicitacaoAlteracaoResponse> solicitarAlteracao(
            @PathVariable Long id,
            @Valid @RequestBody SolicitacaoAlteracaoRequest request,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(solicitacaoService.solicitar(id, request, httpRequest));
    }

    @GetMapping("/solicitacoes")
    public Page<SolicitacaoAlteracaoResponse> listarMinhasSolicitacoes(
            @PageableDefault(size = 20) Pageable pageable) {
        return solicitacaoService.listarMinhasSolicitacoes(pageable);
    }

    @DeleteMapping("/solicitacoes/{id}")
    public ResponseEntity<Void> cancelarSolicitacao(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        solicitacaoService.cancelar(id, httpRequest);
        return ResponseEntity.noContent().build();
    }
}