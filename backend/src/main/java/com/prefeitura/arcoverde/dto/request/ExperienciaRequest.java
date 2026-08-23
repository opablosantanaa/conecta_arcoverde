package com.prefeitura.arcoverde.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record ExperienciaRequest(
        Long id,
        @NotBlank(message = "Empresa é obrigatória") @Size(max = 150) String empresa,
        @NotBlank(message = "Cargo é obrigatório") @Size(max = 150) String cargo,
        @Size(max = 2000) String descricao,
        LocalDate dataInicio,
        LocalDate dataFim,
        Boolean atual
) {
}