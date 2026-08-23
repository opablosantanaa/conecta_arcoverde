package com.prefeitura.arcoverde.repository;

import com.prefeitura.arcoverde.model.Formacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FormacaoRepository extends JpaRepository<Formacao, Long> {
    List<Formacao> findByCurriculoIdOrderByDataInicioDesc(Long curriculoId);
    void deleteByCurriculoId(Long curriculoId);
}