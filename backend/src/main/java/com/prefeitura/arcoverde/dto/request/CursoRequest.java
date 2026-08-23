package com.prefeitura.arcoverde.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CursoRequest(
        @NotBlank(message = "Título é obrigatório") @Size(max = 200) String titulo,
        String descricao,
        @Size(max = 150) String instituicao,
        Long areaId,
        @Size(max = 500) String linkInscricao,
        @Size(max = 500) String linkPlataforma,
        Integer cargaHoraria,
        LocalDate dataInicio,
        LocalDate dataFim
) {
}