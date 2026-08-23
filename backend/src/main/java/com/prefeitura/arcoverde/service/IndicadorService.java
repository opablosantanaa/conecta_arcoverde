package com.prefeitura.arcoverde.service;

import com.prefeitura.arcoverde.dto.response.IndicadoresResponse;
import com.prefeitura.arcoverde.dto.response.IndicadoresResponse.VagasPorArea;
import com.prefeitura.arcoverde.model.Candidatura;
import com.prefeitura.arcoverde.model.Curriculo;
import com.prefeitura.arcoverde.model.Vaga;
import com.prefeitura.arcoverde.model.Curso;
import com.prefeitura.arcoverde.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class IndicadorService {

    private final VagaRepository vagaRepository;
    private final CandidaturaRepository candidaturaRepository;
    private final CurriculoRepository curriculoRepository;
    private final CandidatoRepository candidatoRepository;
    private final CursoRepository cursoRepository;

    public IndicadorService(VagaRepository vagaRepository,
                            CandidaturaRepository candidaturaRepository,
                            CurriculoRepository curriculoRepository,
                            CandidatoRepository candidatoRepository,
                            CursoRepository cursoRepository) {
        this.vagaRepository = vagaRepository;
        this.candidaturaRepository = candidaturaRepository;
        this.curriculoRepository = curriculoRepository;
        this.candidatoRepository = candidatoRepository;
        this.cursoRepository = cursoRepository;
    }

    @Transactional(readOnly = true)
    public IndicadoresResponse obterIndicadores() {
        long totalVagasOfertadas = vagaRepository.count();
        long totalVagasPublicadas = vagaRepository.countByEstadoVaga(Vaga.EstadoVaga.PUBLICADA);
        long totalVagasEncerradas = vagaRepository.countByEstadoVaga(Vaga.EstadoVaga.ENCERRADA);
        long totalVagasPreenchidas = contarVagasComSelecionado();

        long totalCandidatos = candidatoRepository.count();
        long totalCurriculosValidados = curriculoRepository.countByEstado(Curriculo.EstadoCurriculo.VALIDADO);
        long totalCandidaturas = candidaturaRepository.count();
        long totalCursos = cursoRepository.countByEstado(Curso.EstadoCurso.ATIVO);

        List<VagasPorArea> vagasPorArea = vagaRepository.findAll().stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        v -> v.getArea().getNome(),
                        java.util.stream.Collectors.counting()))
                .entrySet().stream()
                .map(e -> new VagasPorArea(e.getKey(), e.getValue()))
                .sorted((a, b) -> Long.compare(b.quantidade(), a.quantidade()))
                .toList();

        Map<String, Long> candidaturasPorStatus = new LinkedHashMap<>();
        for (Candidatura.EstadoCandidatura estado : Candidatura.EstadoCandidatura.values()) {
            candidaturasPorStatus.put(estado.name(), candidaturaRepository.countByEstado(estado));
        }

        BigDecimal taxaOcupacao = IndicadoresResponse.safeRate(totalVagasPreenchidas, totalVagasEncerradas);
        BigDecimal mediaCandidatos = IndicadoresResponse.safeRate(totalCandidaturas, totalVagasOfertadas);

        return new IndicadoresResponse(
                totalVagasOfertadas,
                totalVagasPublicadas,
                totalVagasEncerradas,
                totalVagasPreenchidas,
                totalCandidatos,
                totalCurriculosValidados,
                totalCandidaturas,
                totalCursos,
                vagasPorArea,
                candidaturasPorStatus,
                taxaOcupacao,
                mediaCandidatos
        );
    }

    private long contarVagasComSelecionado() {
        return vagaRepository.findAll().stream()
                .filter(v -> v.getEstadoVaga() == Vaga.EstadoVaga.ENCERRADA)
                .filter(v -> candidaturaRepository.findByVagaIdIn(List.of(v.getId())).stream()
                        .anyMatch(c -> c.getEstado() == Candidatura.EstadoCandidatura.SELECIONADO))
                .count();
    }
}