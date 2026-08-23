package com.prefeitura.arcoverde.dto.request;

import jakarta.validation.constraints.NotNull;

public record CandidaturaRequest(
        @NotNull(message = "Vaga é obrigatória") Long vagaId
) {
}