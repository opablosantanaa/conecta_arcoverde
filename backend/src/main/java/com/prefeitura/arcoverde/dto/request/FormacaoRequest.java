package com.prefeitura.arcoverde.dto.request;

import com.prefeitura.arcoverde.model.Formacao.NivelFormacao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record FormacaoRequest(
        Long id,
        @NotBlank(message = "Instituição é obrigatória") @Size(max = 200) String instituicao,
        @NotBlank(message = "Curso é obrigatório") @Size(max = 200) String curso,
        @NotNull(message = "Nível é obrigatório") NivelFormacao nivel,
        LocalDate dataInicio,
        LocalDate dataFim,
        Boolean concluido
) {
}