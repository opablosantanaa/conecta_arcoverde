package com.prefeitura.arcoverde.dto.response;

import com.prefeitura.arcoverde.model.SolicitacaoAlteracao;

import java.time.LocalDateTime;

public record SolicitacaoAlteracaoResponse(
        Long id,
        Long vagaId,
        String tituloVaga,
        Long solicitanteId,
        String solicitanteNome,
        String solicitanteEmail,
        String descricao,
        String estado,
        LocalDateTime criadoEm,
        Long resolvidoPorId,
        String resolvidoPorNome,
        LocalDateTime resolvidoEm,
        String resposta
) {
    public static SolicitacaoAlteracaoResponse from(SolicitacaoAlteracao s) {
        return new SolicitacaoAlteracaoResponse(
                s.getId(),
                s.getVaga().getId(),
                s.getVaga().getTitulo(),
                s.getSolicitante().getId(),
                s.getSolicitante().getNome(),
                s.getSolicitante().getEmail(),
                s.getDescricao(),
                s.getEstado().name(),
                s.getCriadoEm(),
                s.getResolvidoPor() == null ? null : s.getResolvidoPor().getId(),
                s.getResolvidoPor() == null ? null : s.getResolvidoPor().getNome(),
                s.getResolvidoEm(),
                s.getResposta()
        );
    }
}