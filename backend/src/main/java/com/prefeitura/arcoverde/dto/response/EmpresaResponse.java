package com.prefeitura.arcoverde.dto.response;

import com.prefeitura.arcoverde.model.Empresa;

import java.time.LocalDateTime;

public record EmpresaResponse(
        Long id,
        String nomeFantasia,
        String razaoSocial,
        String cnpj,
        String emailContato,
        String telefone,
        Boolean ocultarNomePublicamente,
        Boolean ativo,
        LocalDateTime criadoEm
) {
    public static EmpresaResponse from(Empresa e) {
        return new EmpresaResponse(
                e.getId(),
                e.getNomeFantasia(),
                e.getRazaoSocial(),
                e.getCnpj(),
                e.getEmailContato(),
                e.getTelefone(),
                e.getOcultarNomePublicamente(),
                e.getAtivo(),
                e.getCriadoEm()
        );
    }
}