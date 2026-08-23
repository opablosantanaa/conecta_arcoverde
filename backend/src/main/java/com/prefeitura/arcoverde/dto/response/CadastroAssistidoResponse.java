package com.prefeitura.arcoverde.dto.response;

import com.prefeitura.arcoverde.model.Candidato;

public record CadastroAssistidoResponse(
        Long candidatoId,
        Long usuarioId,
        String nome,
        String email,
        String cpf,
        Boolean cadastroAssistido,
        Long assistidoPorId,
        String assistidoPorNome,
        Long curriculoId
) {
    public static CadastroAssistidoResponse from(Candidato c, Long curriculoId) {
        return new CadastroAssistidoResponse(
                c.getId(),
                c.getUsuario().getId(),
                c.getUsuario().getNome(),
                c.getUsuario().getEmail(),
                c.getUsuario().getCpf(),
                c.getCadastroAssistido(),
                c.getAssistidoPor() == null ? null : c.getAssistidoPor().getId(),
                c.getAssistidoPor() == null ? null : c.getAssistidoPor().getNome(),
                curriculoId
        );
    }
}