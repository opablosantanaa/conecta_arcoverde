package com.prefeitura.arcoverde.dto.response;

import com.prefeitura.arcoverde.model.Candidatura;

import java.time.LocalDateTime;

public record CandidaturaResponse(
        Long id,
        Long vagaId,
        String tituloVaga,
        String empresaVaga,
        Boolean empresaOculta,
        Long candidatoId,
        String estado,
        String resultado,
        LocalDateTime dataCandidatura,
        LocalDateTime encerradaEm
) {
    public static CandidaturaResponse from(Candidatura c) {
        Boolean oculta = Boolean.TRUE.equals(c.getVaga().getEmpresa().getOcultarNomePublicamente());
        String nomeEmpresa = oculta ? "Empresa confidencial" : c.getVaga().getEmpresa().getNomeFantasia();
        return new CandidaturaResponse(
                c.getId(),
                c.getVaga().getId(),
                c.getVaga().getTitulo(),
                nomeEmpresa,
                oculta,
                c.getCandidato().getId(),
                c.getEstado().name(),
                c.getResultado(),
                c.getDataCandidatura(),
                c.getEncerradaEm()
        );
    }
}