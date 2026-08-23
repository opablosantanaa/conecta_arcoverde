package com.prefeitura.arcoverde.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PermissaoRequest(
        @NotBlank String funcionalidade,
        @NotNull Boolean permitido
) {
}