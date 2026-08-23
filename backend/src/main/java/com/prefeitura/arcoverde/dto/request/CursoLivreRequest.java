package com.prefeitura.arcoverde.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CursoLivreRequest(
        Long id,
        @NotBlank(message = "Nome do curso é obrigatório") @Size(max = 200) String nome,
        @Size(max = 200) String instituicao,
        Integer cargaHoraria,
        Integer anoConclusao
) {
}