package com.prefeitura.arcoverde.dto.response;

import com.prefeitura.arcoverde.model.Vaga;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record VagaPublicaResponse(
        Long id,
        String titulo,
        String descricao,
        String nomeEmpresa,
        Boolean empresaOculta,
        String area,
        String requisitos,
        String beneficios,
        BigDecimal salarioMinimo,
        BigDecimal salarioMaximo,
        String tipoContrato,
        Integer quantidadeVagas,
        String cidade,
        String estado,
        LocalDateTime criadoEm
) {
    public static VagaPublicaResponse from(Vaga v) {
        Boolean oculta = Boolean.TRUE.equals(v.getEmpresa().getOcultarNomePublicamente());
        String nome = oculta ? "Empresa confidencial" : v.getEmpresa().getNomeFantasia();
        return new VagaPublicaResponse(
                v.getId(),
                v.getTitulo(),
                v.getDescricao(),
                nome,
                oculta,
                v.getArea().getNome(),
                v.getRequisitos(),
                v.getBeneficios(),
                v.getSalarioMinimo(),
                v.getSalarioMaximo(),
                v.getTipoContrato() == null ? null : v.getTipoContrato().name(),
                v.getQuantidadeVagas(),
                v.getCidade(),
                v.getEstado(),
                v.getCriadoEm()
        );
    }
}