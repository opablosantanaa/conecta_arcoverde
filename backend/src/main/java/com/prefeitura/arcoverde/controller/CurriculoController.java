package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.dto.request.CurriculoRequest;
import com.prefeitura.arcoverde.dto.response.CurriculoResponse;
import com.prefeitura.arcoverde.service.CurriculoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class CurriculoController {

    private final CurriculoService curriculoService;

    public CurriculoController(CurriculoService curriculoService) {
        this.curriculoService = curriculoService;
    }

    // ===== CANDIDATO =====
    @GetMapping("/candidato/curriculo")
    public CurriculoResponse meuCurriculo() {
        return curriculoService.buscarMeuCurriculo();
    }

    @PutMapping("/candidato/curriculo")
    public ResponseEntity<CurriculoResponse> salvarMeuCurriculo(
            @Valid @RequestBody CurriculoRequest request,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(curriculoService.salvarMeuCurriculo(request, httpRequest));
    }

    @PostMapping("/candidato/curriculo/submeter")
    public ResponseEntity<CurriculoResponse> submeter(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(curriculoService.submeterParaValidacao(httpRequest));
    }

    // ===== ACA / PREFEITURA =====
    @GetMapping("/aca/curriculos")
    public Page<CurriculoResponse> listarTodos(
            @PageableDefault(size = 20, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return curriculoService.listarTodos(pageable);
    }

    @GetMapping("/aca/curriculos/pendentes")
    public Page<CurriculoResponse> listarPendentes(
            @PageableDefault(size = 20, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return curriculoService.listarPendentes(pageable);
    }

    @GetMapping("/aca/curriculos/candidato/{candidatoId}")
    public CurriculoResponse buscarPorCandidato(@PathVariable Long candidatoId) {
        return curriculoService.buscarPorCandidatoId(candidatoId);
    }

    @PostMapping("/aca/curriculos/{id}/validar")
    public ResponseEntity<CurriculoResponse> validar(@PathVariable Long id, HttpServletRequest httpRequest) {
        return ResponseEntity.ok(curriculoService.validar(id, httpRequest));
    }

    @PostMapping("/aca/curriculos/{id}/rejeitar")
    public ResponseEntity<CurriculoResponse> rejeitar(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(curriculoService.rejeitar(id, body.get("motivo"), httpRequest));
    }
}