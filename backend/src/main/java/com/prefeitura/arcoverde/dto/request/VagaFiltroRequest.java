package com.prefeitura.arcoverde.dto.request;

import com.prefeitura.arcoverde.model.Vaga.TipoContrato;

public record VagaFiltroRequest(
        String titulo,
        Long areaId,
        String cidade,
        TipoContrato tipoContrato
) {
}