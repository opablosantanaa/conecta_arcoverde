package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.dto.request.AreaRequest;
import com.prefeitura.arcoverde.dto.response.AreaResponse;
import com.prefeitura.arcoverde.service.AreaService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/areas")
public class AreaController {

    private final AreaService areaService;

    public AreaController(AreaService areaService) {
        this.areaService = areaService;
    }

    @GetMapping
    public List<AreaResponse> listarTodas() {
        return areaService.listarTodas();
    }

    @GetMapping("/paginado")
    public Page<AreaResponse> listarPaginado(
            @PageableDefault(size = 50, sort = "nome", direction = Sort.Direction.ASC) Pageable pageable) {
        return areaService.listarPaginado(pageable);
    }

    @GetMapping("/{id}")
    public AreaResponse buscarPorId(@PathVariable Long id) {
        return areaService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<AreaResponse> criar(
            @Valid @RequestBody AreaRequest request,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(areaService.criar(request, httpRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AreaResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody AreaRequest request,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(areaService.atualizar(id, request, httpRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id, HttpServletRequest httpRequest) {
        areaService.remover(id, httpRequest);
        return ResponseEntity.noContent().build();
    }
}