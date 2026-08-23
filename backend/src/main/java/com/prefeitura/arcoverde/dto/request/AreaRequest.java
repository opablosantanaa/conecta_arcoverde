package com.prefeitura.arcoverde.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AreaRequest(
        @NotBlank(message = "Nome é obrigatório") @Size(max = 100) String nome,
        @Size(max = 1000) String descricao
) {
}