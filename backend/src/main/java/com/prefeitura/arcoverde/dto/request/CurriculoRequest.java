package com.prefeitura.arcoverde.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

public record CurriculoRequest(
        @Size(max = 2000, message = "Objetivo deve ter no máximo 2000 caracteres")
        String objetivo,

        @Size(max = 3000, message = "Resumo deve ter no máximo 3000 caracteres")
        String resumoProfissional,

        @Valid List<ExperienciaRequest> experiencias,
        @Valid List<FormacaoRequest> formacoes,
        @Valid List<CursoLivreRequest> cursosLivres,
        @NotEmpty(message = "Selecione pelo menos uma �rea de interesse") List<Long> areasInteresseIds
) {
    public CurriculoRequest {
        if (experiencias == null) experiencias = new ArrayList<>();
        if (formacoes == null) formacoes = new ArrayList<>();
        if (cursosLivres == null) cursosLivres = new ArrayList<>();
        if (areasInteresseIds == null) areasInteresseIds = new ArrayList<>();
    }
}