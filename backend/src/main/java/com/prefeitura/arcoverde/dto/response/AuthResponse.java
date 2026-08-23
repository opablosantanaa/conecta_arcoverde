package com.prefeitura.arcoverde.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tipo;
    private Long usuarioId;
    private String perfil;
}