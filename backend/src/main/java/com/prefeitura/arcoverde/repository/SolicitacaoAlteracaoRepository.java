package com.prefeitura.arcoverde.repository;

import com.prefeitura.arcoverde.model.SolicitacaoAlteracao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SolicitacaoAlteracaoRepository extends JpaRepository<SolicitacaoAlteracao, Long> {
    List<SolicitacaoAlteracao> findByVagaIdOrderByCriadoEmDesc(Long vagaId);
    Page<SolicitacaoAlteracao> findBySolicitanteIdOrderByCriadoEmDesc(Long solicitanteId, Pageable pageable);
    Page<SolicitacaoAlteracao> findByEstadoOrderByCriadoEmDesc(SolicitacaoAlteracao.EstadoSolicitacao estado, Pageable pageable);
    Page<SolicitacaoAlteracao> findAllByOrderByCriadoEmDesc(Pageable pageable);
    boolean existsByVagaIdAndEstado(Long vagaId, SolicitacaoAlteracao.EstadoSolicitacao estado);
}