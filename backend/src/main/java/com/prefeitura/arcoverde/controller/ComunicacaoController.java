package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.model.Comunicacao;
import com.prefeitura.arcoverde.repository.ComunicacaoRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/aca/comunicacoes")
public class ComunicacaoController {

    private final ComunicacaoRepository comunicacaoRepository;

    public ComunicacaoController(ComunicacaoRepository comunicacaoRepository) {
        this.comunicacaoRepository = comunicacaoRepository;
    }

    @GetMapping("/candidaturas/{candidaturaId}")
    public List<Comunicacao> listarPorCandidatura(@PathVariable Long candidaturaId) {
        return comunicacaoRepository.findByCandidaturaIdOrderByEnviadoEmDesc(candidaturaId);
    }
}