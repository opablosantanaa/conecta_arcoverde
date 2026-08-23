package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.dto.request.UsuarioAdminRequest;
import com.prefeitura.arcoverde.dto.response.UsuarioAdminResponse;
import com.prefeitura.arcoverde.service.AdminUserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/usuarios")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping
    public Page<UsuarioAdminResponse> listar(
            @PageableDefault(size = 20, sort = "nome", direction = Sort.Direction.ASC) Pageable pageable) {
        return adminUserService.listar(pageable);
    }

    @GetMapping("/{id}")
    public UsuarioAdminResponse buscarPorId(@PathVariable Long id) {
        return adminUserService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<UsuarioAdminResponse> criar(
            @Valid @RequestBody UsuarioAdminRequest request,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(adminUserService.criar(request, httpRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioAdminResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioAdminRequest request,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(adminUserService.atualizar(id, request, httpRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar(@PathVariable Long id, HttpServletRequest httpRequest) {
        adminUserService.desativar(id, httpRequest);
        return ResponseEntity.noContent().build();
    }
}