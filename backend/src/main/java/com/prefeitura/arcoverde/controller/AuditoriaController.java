package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.model.Auditoria;
import com.prefeitura.arcoverde.repository.AuditoriaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/auditoria")
public class AuditoriaController {

    private final AuditoriaRepository auditoriaRepository;

    public AuditoriaController(AuditoriaRepository auditoriaRepository) {
        this.auditoriaRepository = auditoriaRepository;
    }

    @GetMapping
    public Page<Auditoria> listarTodos(
            @PageableDefault(size = 50, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return auditoriaRepository.findAll(pageable);
    }

    @GetMapping("/usuarios/{usuarioId}")
    public Page<Auditoria> listarPorUsuario(
            @PathVariable Long usuarioId,
            @PageableDefault(size = 50, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return auditoriaRepository.findByUsuarioId(usuarioId, pageable);
    }
}