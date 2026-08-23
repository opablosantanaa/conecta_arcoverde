package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.dto.request.EsqueciSenhaRequest;
import com.prefeitura.arcoverde.dto.request.RedefinirSenhaRequest;
import com.prefeitura.arcoverde.service.RecuperacaoSenhaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class RecuperacaoSenhaController {

    private final RecuperacaoSenhaService recuperacaoSenhaService;

    public RecuperacaoSenhaController(RecuperacaoSenhaService recuperacaoSenhaService) {
        this.recuperacaoSenhaService = recuperacaoSenhaService;
    }

    @PostMapping("/esqueci-senha")
    public ResponseEntity<Map<String, String>> solicitar(@Valid @RequestBody EsqueciSenhaRequest request) {
        recuperacaoSenhaService.solicitarRedefinicao(request);
        // Sempre retorna mensagem genérica (LGPD - não vazar existência de conta)
        return ResponseEntity.ok(Map.of(
                "mensagem", "Se o e-mail estiver cadastrado, enviaremos instruções de recuperação."
        ));
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<Map<String, String>> redefinir(@Valid @RequestBody RedefinirSenhaRequest request) {
        recuperacaoSenhaService.redefinir(request);
        return ResponseEntity.ok(Map.of("mensagem", "Senha redefinida com sucesso"));
    }
}