package com.prefeitura.arcoverde.dto.response;

import com.prefeitura.arcoverde.model.Candidatura;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record CandidaturaEmpresaResponse(
        Long candidaturaId,
        Long candidatoId,
        String nomeCandidato,
        String emailCandidato,
        String telefoneCandidato,
        LocalDate dataNascimento,
        String cidade,
        String estado,
        String objetivoCurriculo,
        String resumoProfissional,
        List<ExperienciaResponse> experiencias,
        List<FormacaoResponse> formacoes,
        List<CursoLivreResponse> cursosLivres,
        List<AreaResponse> areasInteresse,
        String estadoCandidatura,
        LocalDateTime dataCandidatura
) {
    public static CandidaturaEmpresaResponse from(Candidatura c,
                                                  List<ExperienciaResponse> exps,
                                                  List<FormacaoResponse> forms,
                                                  List<CursoLivreResponse> cursos,
                                                  List<AreaResponse> areas) {
        return new CandidaturaEmpresaResponse(
                c.getId(),
                c.getCandidato().getId(),
                c.getCandidato().getUsuario().getNome(),
                c.getCandidato().getUsuario().getEmail(),
                c.getCandidato().getUsuario().getTelefone(),
                c.getCandidato().getDataNascimento(),
                c.getCandidato().getCidade(),
                c.getCandidato().getEstado(),
                c.getCurriculo().getObjetivo(),
                c.getCurriculo().getResumoProfissional(),
                exps, forms, cursos, areas,
                c.getEstado().name(),
                c.getDataCandidatura()
        );
    }
}