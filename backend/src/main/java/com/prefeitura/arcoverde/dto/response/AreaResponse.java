package com.prefeitura.arcoverde.dto.response;

import com.prefeitura.arcoverde.model.Area;

public record AreaResponse(Long id, String nome, String descricao) {
    public static AreaResponse from(Area area) {
        return new AreaResponse(area.getId(), area.getNome(), area.getDescricao());
    }
}