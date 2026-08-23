package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private VagaRepository vagaRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @GetMapping
    public ResponseEntity<Map<String, Long>> getEstatisticas() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsuarios", usuarioRepository.count());
        stats.put("totalVagas", vagaRepository.count());
        stats.put("totalCursos", cursoRepository.count());
        return ResponseEntity.ok(stats);
    }
}
