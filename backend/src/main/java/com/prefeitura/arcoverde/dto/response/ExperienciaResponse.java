package com.prefeitura.arcoverde.dto.response;

import com.prefeitura.arcoverde.model.Experiencia;

import java.time.LocalDate;

public record ExperienciaResponse(
        Long id,
        String empresa,
        String cargo,
        String descricao,
        LocalDate dataInicio,
        LocalDate dataFim,
        Boolean atual
) {
    public static ExperienciaResponse from(Experiencia e) {
        return new ExperienciaResponse(e.getId(), e.getEmpresa(), e.getCargo(),
                e.getDescricao(), e.getDataInicio(), e.getDataFim(), e.getAtual());
    }
}