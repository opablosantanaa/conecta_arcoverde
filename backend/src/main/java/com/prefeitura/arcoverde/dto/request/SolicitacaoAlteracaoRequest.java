package com.prefeitura.arcoverde.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SolicitacaoAlteracaoRequest(
        @NotBlank(message = "Descrição é obrigatória")
        @Size(min = 20, max = 4000, message = "Descrição deve ter entre 20 e 4000 caracteres")
        String descricao
) {
}