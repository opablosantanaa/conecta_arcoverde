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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CursoController {

    private final CursoService cursoService;

    public CursoController(CursoService cursoService) {
        this.cursoService = cursoService;
    }

    @GetMapping("/cursos/public")
    public Page<CursoResponse> listarPublicos(
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) Long areaId,
            @PageableDefault(size = 20, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return cursoService.buscarPublico(titulo, areaId, pageable);
    }

    @GetMapping("/prefeitura/cursos")
    public Page<CursoResponse> listarTodos(
            @PageableDefault(size = 20, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return cursoService.listarTodos(pageable);
    }

    @PostMapping("/prefeitura/cursos")
    public ResponseEntity<CursoResponse> criar(
            @Valid @RequestBody CursoRequest request,
            HttpServletRequest httpRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cursoService.criar(request, httpRequest));
    }

    @PutMapping("/prefeitura/cursos/{id}")
    public CursoResponse atualizar(
            @PathVariable Long id,
            @Valid @RequestBody CursoRequest request,
            HttpServletRequest httpRequest) {
        return cursoService.atualizar(id, request, httpRequest);
    }

    @DeleteMapping("/prefeitura/cursos/{id}")
    public ResponseEntity<Void> desativar(@PathVariable Long id, HttpServletRequest httpRequest) {
        cursoService.desativar(id, httpRequest);
        return ResponseEntity.noContent().build();
    }
}
