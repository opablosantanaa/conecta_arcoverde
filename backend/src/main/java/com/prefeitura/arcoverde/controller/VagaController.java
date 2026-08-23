package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.model.Vaga;
import com.prefeitura.arcoverde.repository.VagaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/vagas")
@CrossOrigin(origins = "*")
public class VagaController {

    @Autowired
    private VagaRepository vagaRepository;

    @GetMapping
    public ResponseEntity<List<Vaga>> listarTodas() {
        return ResponseEntity.ok(vagaRepository.findAll());
    }
}
