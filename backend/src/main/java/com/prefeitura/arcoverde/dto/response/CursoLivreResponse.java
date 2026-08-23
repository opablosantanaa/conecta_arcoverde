package com.prefeitura.arcoverde.dto.response;

import com.prefeitura.arcoverde.model.CursoLivre;

public record CursoLivreResponse(
        Long id, String nome, String instituicao, Integer cargaHoraria, Integer anoConclusao
) {
    public static CursoLivreResponse from(CursoLivre c) {
        return new CursoLivreResponse(c.getId(), c.getNome(), c.getInstituicao(),
                c.getCargaHoraria(), c.getAnoConclusao());
    }
}