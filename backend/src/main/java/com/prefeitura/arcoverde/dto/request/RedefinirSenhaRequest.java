package com.prefeitura.arcoverde.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RedefinirSenhaRequest(
        @NotBlank String token,
        @NotBlank @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres") String novaSenha
) {
}