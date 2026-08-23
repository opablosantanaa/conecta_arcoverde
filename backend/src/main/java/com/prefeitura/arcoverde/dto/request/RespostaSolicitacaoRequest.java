package com.prefeitura.arcoverde.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RespostaSolicitacaoRequest(
        @NotNull(message = "Aprovação é obrigatória")
        Boolean aprovar,

        @NotBlank(message = "Resposta é obrigatória")
        @Size(max = 4000) String resposta
) {
}