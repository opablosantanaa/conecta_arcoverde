package com.prefeitura.arcoverde.dto.response;

import com.prefeitura.arcoverde.model.Vaga;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record VagaResponse(
        Long id,
        String titulo,
        String descricao,
        Long empresaId,
        String nomeEmpresa,
        Boolean empresaOculta,
        Long areaId,
        String areaNome,
        String requisitos,
        String beneficios,
        BigDecimal salarioMinimo,
        BigDecimal salarioMaximo,
        String tipoContrato,
        Integer quantidadeVagas,
        String cidade,
        String estado,
        String estadoVaga,
        Boolean podeEditarDiretamente,
        Long cadastradaPorId,
        String cadastradaPorNome,
        LocalDateTime aprovadaEm,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
    public static VagaResponse from(Vaga v, Boolean podeEditarDiretamente) {
        return new VagaResponse(
                v.getId(),
                v.getTitulo(),
                v.getDescricao(),
                v.getEmpresa().getId(),
                v.getEmpresa().getNomeFantasia(),
                Boolean.TRUE.equals(v.getEmpresa().getOcultarNomePublicamente()),
                v.getArea().getId(),
                v.getArea().getNome(),
                v.getRequisitos(),
                v.getBeneficios(),
                v.getSalarioMinimo(),
                v.getSalarioMaximo(),
                v.getTipoContrato() == null ? null : v.getTipoContrato().name(),
                v.getQuantidadeVagas(),
                v.getCidade(),
                v.getEstado(),
                v.getEstadoVaga().name(),
                podeEditarDiretamente,
                v.getCadastradaPor().getId(),
                v.getCadastradaPor().getNome(),
                v.getAprovadaEm(),
                v.getCriadoEm(),
                v.getAtualizadoEm()
        );
    }
}