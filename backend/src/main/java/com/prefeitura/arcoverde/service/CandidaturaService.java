package com.prefeitura.arcoverde.service;

import com.prefeitura.arcoverde.dto.request.CandidaturaRequest;
import com.prefeitura.arcoverde.dto.response.CandidaturaResponse;
import com.prefeitura.arcoverde.exception.BusinessException;
import com.prefeitura.arcoverde.exception.ResourceNotFoundException;
import com.prefeitura.arcoverde.model.*;
import com.prefeitura.arcoverde.repository.*;
import com.prefeitura.arcoverde.security.UserDetailsImpl;
import com.prefeitura.arcoverde.util.DateUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class CandidaturaService {

    private final CandidaturaRepository candidaturaRepository;
    private final CandidatoRepository candidatoRepository;
    private final CurriculoRepository curriculoRepository;
    private final VagaRepository vagaRepository;
    private final AuditoriaService auditoriaService;

    public CandidaturaService(CandidaturaRepository candidaturaRepository,
                              CandidatoRepository candidatoRepository,
                              CurriculoRepository curriculoRepository,
                              VagaRepository vagaRepository,
                              AuditoriaService auditoriaService) {
        this.candidaturaRepository = candidaturaRepository;
        this.candidatoRepository = candidatoRepository;
        this.curriculoRepository = curriculoRepository;
        this.vagaRepository = vagaRepository;
        this.auditoriaService = auditoriaService;
    }

    @Transactional
    public CandidaturaResponse candidatar(CandidaturaRequest request, HttpServletRequest httpRequest) {
        Long usuarioId = usuarioAtualId();

        Candidato candidato = candidatoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new BusinessException("Candidato não encontrado"));

        Curriculo curriculo = curriculoRepository.findByCandidatoId(candidato.getId())
                .orElseThrow(() -> new BusinessException("Você precisa ter um currículo cadastrado"));

        if (curriculo.getEstado() != Curriculo.EstadoCurriculo.VALIDADO) {
            throw new BusinessException("Seu currículo precisa estar validado pela ACA/Prefeitura antes de se candidatar");
        }

        Vaga vaga = vagaRepository.findById(request.vagaId())
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada"));

        if (vaga.getEstadoVaga() != Vaga.EstadoVaga.PUBLICADA) {
            throw new BusinessException("Esta vaga não está mais disponível para candidatura");
        }

        if (candidaturaRepository.existsByVagaIdAndCandidatoId(vaga.getId(), candidato.getId())) {
            throw new BusinessException("Você já se candidatou a esta vaga");
        }

        Candidatura candidatura = Candidatura.builder()
                .vaga(vaga)
                .candidato(candidato)
                .curriculo(curriculo)
                .estado(Candidatura.EstadoCandidatura.INSCRITO)
                .dataCandidatura(DateUtil.agora())
                .build();

        candidatura = candidaturaRepository.save(candidatura);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("vagaId", vaga.getId());
        detalhes.put("vagaTitulo", vaga.getTitulo());
        auditoriaService.registrar("CANDIDATAR", "CANDIDATURA",
                candidatura.getId(), detalhes, httpRequest);

        return CandidaturaResponse.from(candidatura);
    }

    @Transactional(readOnly = true)
    public Page<CandidaturaResponse> listarMinhasCandidaturas(Pageable pageable) {
        Long usuarioId = usuarioAtualId();
        Candidato candidato = candidatoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new BusinessException("Candidato não encontrado"));

        return candidaturaRepository
                .findByCandidatoIdOrderByDataCandidaturaDesc(candidato.getId(), pageable)
                .map(CandidaturaResponse::from);
    }

    @Transactional(readOnly = true)
    public CandidaturaResponse buscarMinhaCandidatura(Long candidaturaId) {
        Long usuarioId = usuarioAtualId();
        Candidato candidato = candidatoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new BusinessException("Candidato não encontrado"));

        Candidatura candidatura = candidaturaRepository.findById(candidaturaId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidatura não encontrada"));

        if (!candidatura.getCandidato().getId().equals(candidato.getId())) {
            throw new BusinessException("Você não tem acesso a esta candidatura");
        }

        return CandidaturaResponse.from(candidatura);
    }

    private Long usuarioAtualId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl u) {
            return u.getId();
        }
        throw new BusinessException("Usuário não autenticado");
    }
}