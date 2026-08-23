package com.prefeitura.arcoverde.repository;

import com.prefeitura.arcoverde.model.CursoLivre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CursoLivreRepository extends JpaRepository<CursoLivre, Long> {
    List<CursoLivre> findByCurriculoIdOrderByAnoConclusaoDesc(Long curriculoId);
    void deleteByCurriculoId(Long curriculoId);
}