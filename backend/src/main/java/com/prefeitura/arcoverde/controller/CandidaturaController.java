package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.dto.request.CandidaturaRequest;
import com.prefeitura.arcoverde.dto.response.CandidaturaResponse;
import com.prefeitura.arcoverde.service.CandidaturaService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidato/candidaturas")
public class CandidaturaController {

    private final CandidaturaService candidaturaService;

    public CandidaturaController(CandidaturaService candidaturaService) {
        this.candidaturaService = candidaturaService;
    }

    @PostMapping
    public ResponseEntity<CandidaturaResponse> candidatar(
            @Valid @RequestBody CandidaturaRequest request,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(candidaturaService.candidatar(request, httpRequest));
    }

    @GetMapping
    public Page<CandidaturaResponse> listarMinhas(
            @PageableDefault(size = 20) Pageable pageable) {
        return candidaturaService.listarMinhasCandidaturas(pageable);
    }

    @GetMapping("/{id}")
    public CandidaturaResponse buscarMinha(@PathVariable Long id) {
        return candidaturaService.buscarMinhaCandidatura(id);
    }
}