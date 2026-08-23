package com.prefeitura.arcoverde.dto.response;

import com.prefeitura.arcoverde.model.Usuario;
import com.prefeitura.arcoverde.model.enums.Perfil;

import java.time.LocalDateTime;

public record UsuarioAdminResponse(
        Long id,
        String nome,
        String email,
        String cpf,
        String telefone,
        Perfil perfil,
        Boolean ativo,
        LocalDateTime criadoEm,
        LocalDateTime ultimoAcesso
) {
    public static UsuarioAdminResponse from(Usuario usuario) {
        return new UsuarioAdminResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getCpf(),
                usuario.getTelefone(),
                usuario.getPerfil(),
                usuario.getAtivo(),
                usuario.getCriadoEm(),
                usuario.getUltimoAcesso()
        );
    }
}