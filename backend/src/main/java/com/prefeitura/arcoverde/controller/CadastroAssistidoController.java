package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.dto.request.CadastroAssistidoRequest;
import com.prefeitura.arcoverde.dto.response.CadastroAssistidoResponse;
import com.prefeitura.arcoverde.service.CadastroAssistidoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/aca/cadastro-assistido")
public class CadastroAssistidoController {

    private final CadastroAssistidoService cadastroAssistidoService;

    public CadastroAssistidoController(CadastroAssistidoService cadastroAssistidoService) {
        this.cadastroAssistidoService = cadastroAssistidoService;
    }

    @PostMapping
    public ResponseEntity<CadastroAssistidoResponse> cadastrar(
            @Valid @RequestBody CadastroAssistidoRequest request,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(cadastroAssistidoService.cadastrar(request, httpRequest));
    }
}