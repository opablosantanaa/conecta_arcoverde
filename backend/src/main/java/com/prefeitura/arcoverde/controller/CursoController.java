package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.dto.request.CursoRequest;
import com.prefeitura.arcoverde.dto.response.CursoResponse;
import com.prefeitura.arcoverde.service.CursoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CursoController {

    private final CursoService cursoService;

    public CursoController(CursoService cursoService) {
        this.cursoService = cursoService;
    }

    // ===== PÚBLICO =====
    @GetMapping("/cursos/public")
    public Page<CursoResponse> buscarPublico(
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) Long areaId,
            @PageableDefault(size = 20, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return cursoService.buscarPublico(titulo, areaId, pageable);
    }

    @GetMapping("/cursos/public/{id}")
    public CursoResponse buscarPublicoPorId(@PathVariable Long id) {
        return cursoService.buscarPorId(id);
    }

    // ===== PREFEITURA =====
    @GetMapping("/prefeitura/cursos")
    public Page<CursoResponse> listarTodos(
            @PageableDefault(size = 20, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return cursoService.listarTodos(pageable);
    }

    @GetMapping("/prefeitura/cursos/{id}")
    public CursoResponse buscarPorId(@PathVariable Long id) {
        return cursoService.buscarPorId(id);
    }

    @PostMapping("/prefeitura/cursos")
    public ResponseEntity<CursoResponse> criar(
            @Valid @RequestBody CursoRequest request,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(cursoService.criar(request, httpRequest));
    }

    @PutMapping("/prefeitura/cursos/{id}")
    public ResponseEntity<CursoResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody CursoRequest request,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(cursoService.atualizar(id, request, httpRequest));
    }

    @DeleteMapping("/prefeitura/cursos/{id}")
    public ResponseEntity<CursoResponse> desativar(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(cursoService.desativar(id, httpRequest));
    }
}