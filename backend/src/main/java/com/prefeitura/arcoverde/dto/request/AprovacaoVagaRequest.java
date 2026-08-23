package com.prefeitura.arcoverde.dto.request;

import jakarta.validation.constraints.NotNull;

public record AprovacaoVagaRequest(
        @NotNull Boolean aprovar,
        String motivo
) {
}