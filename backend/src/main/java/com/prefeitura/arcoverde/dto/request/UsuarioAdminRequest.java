package com.prefeitura.arcoverde.dto.request;

import com.prefeitura.arcoverde.model.enums.Perfil;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UsuarioAdminRequest(
        @NotBlank String nome,
        @NotBlank @Email String email,
        String senha,
        String cpf,
        String telefone,
        @NotNull Perfil perfil,
        Boolean ativo
) {
}