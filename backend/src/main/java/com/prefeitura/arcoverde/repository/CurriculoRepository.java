package com.prefeitura.arcoverde.repository;

import com.prefeitura.arcoverde.model.Curriculo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CurriculoRepository extends JpaRepository<Curriculo, Long> {
    Optional<Curriculo> findByCandidatoId(Long candidatoId);
    Optional<Curriculo> findByCandidatoUsuarioId(Long usuarioId);
    Optional<Curriculo> findByCandidatoUsuarioEmail(String email);
    Page<Curriculo> findByEstado(Curriculo.EstadoCurriculo estado, Pageable pageable);
    long countByEstado(Curriculo.EstadoCurriculo estado);
}