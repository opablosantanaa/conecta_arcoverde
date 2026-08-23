package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.dto.request.PermissaoRequest;
import com.prefeitura.arcoverde.dto.response.PermissaoResponse;
import com.prefeitura.arcoverde.service.PermissaoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/permissoes")
public class AdminPermissaoController {

    private final PermissaoService permissaoService;

    public AdminPermissaoController(PermissaoService permissaoService) {
        this.permissaoService = permissaoService;
    }

    @GetMapping("/usuarios/{usuarioId}")
    public List<PermissaoResponse> listarPorUsuario(@PathVariable Long usuarioId) {
        return permissaoService.listarPorUsuario(usuarioId);
    }

    @PutMapping("/usuarios/{usuarioId}")
    public ResponseEntity<PermissaoResponse> salvar(
            @PathVariable Long usuarioId,
            @Valid @RequestBody PermissaoRequest request,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(permissaoService.salvar(usuarioId, request, httpRequest));
    }

    @DeleteMapping("/usuarios/{usuarioId}/funcionalidades/{funcionalidade}")
    public ResponseEntity<Void> remover(
            @PathVariable Long usuarioId,
            @PathVariable String funcionalidade,
            HttpServletRequest httpRequest) {
        permissaoService.remover(usuarioId, funcionalidade, httpRequest);
        return ResponseEntity.noContent().build();
    }
}