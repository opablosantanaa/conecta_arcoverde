package com.prefeitura.arcoverde.dto.response;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

public record IndicadoresResponse(
        long totalVagasOfertadas,
        long totalVagasPublicadas,
        long totalVagasEncerradas,
        long totalVagasPreenchidas,
        long totalCandidatosCadastrados,
        long totalCurriculosValidados,
        long totalCandidaturas,
        long totalCursosDisponiveis,
        List<VagasPorArea> vagasPorArea,
        Map<String, Long> candidaturasPorStatus,
        BigDecimal taxaOcupacao,
        BigDecimal mediaCandidatosPorVaga
) {
    public record VagasPorArea(String area, long quantidade) {}

    public static BigDecimal safeRate(long numerador, long denominador) {
        if (denominador == 0) return BigDecimal.ZERO;
        return BigDecimal.valueOf(numerador)
                .divide(BigDecimal.valueOf(denominador), 4, RoundingMode.HALF_UP);
    }
}