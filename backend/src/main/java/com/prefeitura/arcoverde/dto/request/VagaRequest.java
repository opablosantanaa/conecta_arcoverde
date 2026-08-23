package com.prefeitura.arcoverde.dto.request;

import com.prefeitura.arcoverde.model.Vaga.TipoContrato;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record VagaRequest(
        @NotBlank(message = "Título é obrigatório") @Size(max = 150) String titulo,
        @NotBlank(message = "Descrição é obrigatória") String descricao,
        @NotNull(message = "Empresa é obrigatória") Long empresaId,
        @NotNull(message = "Área é obrigatória") Long areaId,
        String requisitos,
        String beneficios,
        @Positive BigDecimal salarioMinimo,
        @Positive BigDecimal salarioMaximo,
        TipoContrato tipoContrato,
        Integer quantidadeVagas,
        @Size(max = 100) String cidade,
        @Size(max = 2) String estado
) {
}