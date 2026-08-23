package com.prefeitura.arcoverde.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EmpresaRequest(
        @NotBlank(message = "Nome fantasia é obrigatório") @Size(max = 150) String nomeFantasia,
        @Size(max = 200) String razaoSocial,
        @Size(max = 18) String cnpj,
        @Email(message = "E-mail inválido") @Size(max = 150) String emailContato,
        @Size(max = 20) String telefone,
        String endereco,
        Boolean ocultarNomePublicamente
) {
}