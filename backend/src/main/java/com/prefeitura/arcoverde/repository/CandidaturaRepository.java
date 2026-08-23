package com.prefeitura.arcoverde.repository;

import com.prefeitura.arcoverde.model.Candidatura;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CandidaturaRepository extends JpaRepository<Candidatura, Long> {
    boolean existsByVagaIdAndCandidatoId(Long vagaId, Long candidatoId);
    Optional<Candidatura> findByVagaIdAndCandidatoId(Long vagaId, Long candidatoId);
    Page<Candidatura> findByCandidatoIdOrderByDataCandidaturaDesc(Long candidatoId, Pageable pageable);
    List<Candidatura> findByVagaIdIn(List<Long> vagaIds);
    long countByEstado(Candidatura.EstadoCandidatura estado);
    long count();
}