package com.prefeitura.arcoverde.dto.response;

import com.prefeitura.arcoverde.model.Curriculo;

import java.time.LocalDateTime;
import java.util.List;

public record CurriculoResponse(
        Long id,
        Long candidatoId,
        String nomeCandidato,
        String objetivo,
        String resumoProfissional,
        String estado,
        String motivoRejeicao,
        LocalDateTime validadoEm,
        List<ExperienciaResponse> experiencias,
        List<FormacaoResponse> formacoes,
        List<CursoLivreResponse> cursosLivres,
        List<AreaResponse> areasInteresse,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
    public static CurriculoResponse from(Curriculo c,
                                         List<ExperienciaResponse> exps,
                                         List<FormacaoResponse> forms,
                                         List<CursoLivreResponse> cursos,
                                         List<AreaResponse> areas) {
        return new CurriculoResponse(
                c.getId(),
                c.getCandidato().getId(),
                c.getCandidato().getUsuario().getNome(),
                c.getObjetivo(),
                c.getResumoProfissional(),
                c.getEstado().name(),
                c.getMotivoRejeicao(),
                c.getValidadoEm(),
                exps, forms, cursos, areas,
                c.getCriadoEm(),
                c.getAtualizadoEm()
        );
    }
}