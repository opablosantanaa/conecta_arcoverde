package com.prefeitura.arcoverde.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegistroCandidatoRequest {
    @NotBlank
    private String nome;
    
    @NotBlank @Email
    private String email;
    
    @NotBlank @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres")
    private String senha;
    
    private String cpf;
    private String telefone;
}