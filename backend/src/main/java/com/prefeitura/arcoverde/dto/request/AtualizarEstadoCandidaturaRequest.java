package com.prefeitura.arcoverde.dto.request;

import com.prefeitura.arcoverde.model.Candidatura.EstadoCandidatura;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AtualizarEstadoCandidaturaRequest(
        @NotNull(message = "Estado é obrigatório") EstadoCandidatura estado,
        @Size(max = 2000) String resultado
) {
}