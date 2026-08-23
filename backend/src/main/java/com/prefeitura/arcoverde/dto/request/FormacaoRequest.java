package com.prefeitura.arcoverde.dto.request;

import com.prefeitura.arcoverde.model.Formacao.NivelFormacao;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record FormacaoRequest(
        Long id,
        @Size(max = 200) String instituicao,
        @Size(max = 200) String curso,
        NivelFormacao nivel,
        LocalDate dataInicio,
        LocalDate dataFim,
        Boolean concluido
) {
}