package com.prefeitura.arcoverde.repository;

import com.prefeitura.arcoverde.model.Comunicacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComunicacaoRepository extends JpaRepository<Comunicacao, Long> {
    List<Comunicacao> findByCandidaturaIdOrderByEnviadoEmDesc(Long candidaturaId);
}