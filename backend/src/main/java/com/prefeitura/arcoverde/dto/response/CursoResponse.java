package com.prefeitura.arcoverde.dto.response;

import com.prefeitura.arcoverde.model.Curso;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record CursoResponse(
        Long id,
        String titulo,
        String descricao,
        String instituicao,
        Long areaId,
        String areaNome,
        String linkInscricao,
        String linkPlataforma,
        Integer cargaHoraria,
        LocalDate dataInicio,
        LocalDate dataFim,
        String estado,
        Boolean expirado,
        Long cadastradoPorId,
        String cadastradoPorNome,
        LocalDateTime criadoEm
) {
    public static CursoResponse from(Curso c, Boolean expirado) {
        return new CursoResponse(
                c.getId(),
                c.getTitulo(),
                c.getDescricao(),
                c.getInstituicao(),
                c.getArea() == null ? null : c.getArea().getId(),
                c.getArea() == null ? null : c.getArea().getNome(),
                c.getLinkInscricao(),
                c.getLinkPlataforma(),
                c.getCargaHoraria(),
                c.getDataInicio(),
                c.getDataFim(),
                c.getEstado().name(),
                expirado,
                c.getCadastradoPor().getId(),
                c.getCadastradoPor().getNome(),
                c.getCriadoEm()
        );
    }
}