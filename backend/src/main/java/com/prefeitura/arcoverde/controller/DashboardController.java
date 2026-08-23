package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.repository.UsuarioRepository;
import com.prefeitura.arcoverde.repository.VagaRepository;
import com.prefeitura.arcoverde.repository.CursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Map<String, Object>> obterResumo() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsuarios", usuarioRepository.count());
        stats.put("totalVagas", vagaRepository.count());
        stats.put("totalCursos", cursoRepository.count());
        
        // Exemplo de dado extra por tipo (ajuste conforme sua enum Role)
        stats.put("usuariosPorTipo", "Disponível em versão completa"); 
        
        return ResponseEntity.ok(stats);
    }
}