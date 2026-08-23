package com.prefeitura.arcoverde.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> obterDashboard() {
        Map<String, Object> dados = new HashMap<>();
        dados.put("vagasAtivas", 0);
        dados.put("cursosDisponiveis", 0);
        dados.put("usuariosCadastrados", 0);
        return ResponseEntity.ok(dados);
    }
}