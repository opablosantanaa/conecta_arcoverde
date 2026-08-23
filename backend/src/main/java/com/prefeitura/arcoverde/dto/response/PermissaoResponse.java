package com.prefeitura.arcoverde.dto.response;

import com.prefeitura.arcoverde.model.Permissao;

public record PermissaoResponse(
        Long id,
        Long usuarioId,
        String usuarioEmail,
        String funcionalidade,
        Boolean permitido
) {
    public static PermissaoResponse from(Permissao permissao) {
        return new PermissaoResponse(
                permissao.getId(),
                permissao.getUsuario().getId(),
                permissao.getUsuario().getEmail(),
                permissao.getFuncionalidade(),
                permissao.getPermitido()
        );
    }
}