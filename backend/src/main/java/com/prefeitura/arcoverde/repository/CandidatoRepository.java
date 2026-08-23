package com.prefeitura.arcoverde.repository;

import com.prefeitura.arcoverde.model.Candidato;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CandidatoRepository extends JpaRepository<Candidato, Long> {
    Optional<Candidato> findByUsuarioId(Long usuarioId);
    Optional<Candidato> findByUsuarioEmail(String email);
}