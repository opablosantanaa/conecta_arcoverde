package com.prefeitura.arcoverde.dto.request;

import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record ExperienciaRequest(
        Long id,
        @Size(max = 150) String empresa,
        @Size(max = 150) String cargo,
        @Size(max = 2000) String descricao,
        LocalDate dataInicio,
        LocalDate dataFim,
        Boolean atual
) {
}