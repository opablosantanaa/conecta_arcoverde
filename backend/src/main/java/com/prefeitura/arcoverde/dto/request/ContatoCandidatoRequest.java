package com.prefeitura.arcoverde.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContatoCandidatoRequest(
        @NotBlank(message = "E-mail é obrigatório")
        @Email(message = "Informe um e-mail válido")
        @Size(max = 150) String email,

        @NotBlank(message = "Telefone é obrigatório")
        @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres")
        String telefone
) {
}
