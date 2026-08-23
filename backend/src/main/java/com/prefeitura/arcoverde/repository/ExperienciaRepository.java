package com.prefeitura.arcoverde.repository;

import com.prefeitura.arcoverde.model.Experiencia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExperienciaRepository extends JpaRepository<Experiencia, Long> {
    List<Experiencia> findByCurriculoIdOrderByDataInicioDesc(Long curriculoId);
    void deleteByCurriculoId(Long curriculoId);
}