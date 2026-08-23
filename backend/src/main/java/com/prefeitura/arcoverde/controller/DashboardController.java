package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.repository.UsuarioRepository;
import com.prefeitura.arcoverde.repository.VagaRepository;
import com.prefeitura.arcoverde.repository.CursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final UsuarioRepository usuarioRepository;
    private final VagaRepository vagaRepository;
    private final CursoRepository cursoRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getEstatisticas() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsuarios", usuarioRepository.count());
        stats.put("totalVagas", vagaRepository.count());
        stats.put("totalCursos", cursoRepository.count());
        return ResponseEntity.ok(stats);
    }
}
