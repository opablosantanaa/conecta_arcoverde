package com.prefeitura.arcoverde.dto.response;

import com.prefeitura.arcoverde.model.Formacao;

import java.time.LocalDate;

public record FormacaoResponse(
        Long id,
        String instituicao,
        String curso,
        String nivel,
        LocalDate dataInicio,
        LocalDate dataFim,
        Boolean concluido
) {
    public static FormacaoResponse from(Formacao f) {
        return new FormacaoResponse(f.getId(), f.getInstituicao(), f.getCurso(),
                f.getNivel() == null ? null : f.getNivel().name(),
                f.getDataInicio(), f.getDataFim(), f.getConcluido());
    }
}