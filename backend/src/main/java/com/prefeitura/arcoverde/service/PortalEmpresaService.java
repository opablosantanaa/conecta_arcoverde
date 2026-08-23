package com.prefeitura.arcoverde.service;

import com.prefeitura.arcoverde.dto.request.AtualizarEstadoCandidaturaRequest;
import com.prefeitura.arcoverde.dto.request.VagaRequest;
import com.prefeitura.arcoverde.dto.response.*;
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
import java.util.List;
import java.util.Map;

@Service
public class PortalEmpresaService {

    private final EmpresaRepository empresaRepository;
    private final VagaRepository vagaRepository;
    private final CandidaturaRepository candidaturaRepository;
    private final ExperienciaRepository experienciaRepository;
    private final FormacaoRepository formacaoRepository;
    private final CursoLivreRepository cursoLivreRepository;
    private final AreaInteresseRepository areaInteresseRepository;
    private final VagaService vagaService;
    private final UsuarioRepository usuarioRepository;
    private final AuditoriaService auditoriaService;

    public PortalEmpresaService(EmpresaRepository empresaRepository,
                                VagaRepository vagaRepository,
                                CandidaturaRepository candidaturaRepository,
                                ExperienciaRepository experienciaRepository,
                                FormacaoRepository formacaoRepository,
                                CursoLivreRepository cursoLivreRepository,
                                AreaInteresseRepository areaInteresseRepository,
                                VagaService vagaService,
                                UsuarioRepository usuarioRepository,
                                AuditoriaService auditoriaService) {
        this.empresaRepository = empresaRepository;
        this.vagaRepository = vagaRepository;
        this.candidaturaRepository = candidaturaRepository;
        this.experienciaRepository = experienciaRepository;
        this.formacaoRepository = formacaoRepository;
        this.cursoLivreRepository = cursoLivreRepository;
        this.areaInteresseRepository = areaInteresseRepository;
        this.vagaService = vagaService;
        this.usuarioRepository = usuarioRepository;
        this.auditoriaService = auditoriaService;
    }

    /**
     * RN021, RNF003: Isolamento total — empresa só vê SUAS vagas.
     */
    @Transactional(readOnly = true)
    public Page<VagaResponse> listarMinhasVagas(Pageable pageable) {
        Empresa empresa = empresaDoUsuarioAtual();
        return vagaRepository.findByEmpresaId(empresa.getId()).stream()
                .map(v -> VagaResponse.from(v, vagaService.podeEditarDiretamente(v)))
                .toList()
                .stream()
                .collect(java.util.stream.Collectors.collectingAndThen(
                        java.util.stream.Collectors.toList(),
                        list -> new org.springframework.data.domain.PageImpl<>(list, pageable, list.size())
                ));
    }

    @Transactional(readOnly = true)
    public VagaResponse buscarMinhaVaga(Long vagaId) {
        Empresa empresa = empresaDoUsuarioAtual();
        Vaga vaga = vagaRepository.findById(vagaId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada"));

        if (!vaga.getEmpresa().getId().equals(empresa.getId())) {
            throw new BusinessException("Você não tem acesso a esta vaga");
        }

        return VagaResponse.from(vaga, vagaService.podeEditarDiretamente(vaga));
    }

    /**
     * RF024-RF025, RN033-RN037: Empresa pode editar diretamente apenas nas primeiras 12h.
     */
    @Transactional
    public VagaResponse editarMinhaVaga(Long vagaId, VagaRequest request, HttpServletRequest httpRequest) {
        Empresa empresa = empresaDoUsuarioAtual();
        Vaga vaga = vagaRepository.findById(vagaId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada"));

        if (!vaga.getEmpresa().getId().equals(empresa.getId())) {
            throw new BusinessException("Você não tem acesso a esta vaga");
        }

        if (!vagaService.podeEditarDiretamente(vaga)) {
            throw new BusinessException(
                    "Edição direta permitida apenas nas primeiras 12 horas após o cadastro. " +
                    "Após esse período, utilize o endpoint de solicitação de alteração."
            );
        }

        // Delega para o serviço principal (que já atualiza o estado conforme necessário)
        return vagaService.atualizar(vagaId, request, httpRequest);
    }

    /**
     * RN021: Empresa só vê candidatos de SUAS vagas — nunca de outras empresas.
     */
    @Transactional(readOnly = true)
    public Page<CandidaturaEmpresaResponse> listarCandidatosDaVaga(Long vagaId, Pageable pageable) {
        Empresa empresa = empresaDoUsuarioAtual();
        Vaga vaga = vagaRepository.findById(vagaId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada"));

        if (!vaga.getEmpresa().getId().equals(empresa.getId())) {
            throw new BusinessException("Você não tem acesso a esta vaga");
        }

        return candidaturaRepository.findByVagaIdIn(List.of(vaga.getId())).stream()
                .map(this::montarCandidaturaEmpresa)
                .toList()
                .stream()
                .collect(java.util.stream.Collectors.collectingAndThen(
                        java.util.stream.Collectors.toList(),
                        list -> new org.springframework.data.domain.PageImpl<>(list, pageable, list.size())
                ));
    }

    /**
     * RF041-RF042: Empresa pode encerrar seleção.
     */
    @Transactional
    public VagaResponse encerrarSelecao(Long vagaId, HttpServletRequest httpRequest) {
        Empresa empresa = empresaDoUsuarioAtual();
        Vaga vaga = vagaRepository.findById(vagaId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada"));

        if (!vaga.getEmpresa().getId().equals(empresa.getId())) {
            throw new BusinessException("Você não tem acesso a esta vaga");
        }

        if (vaga.getEstadoVaga() != Vaga.EstadoVaga.PUBLICADA
                && vaga.getEstadoVaga() != Vaga.EstadoVaga.APROVADA) {
            throw new BusinessException("Apenas vagas publicadas ou aprovadas podem ter a seleção encerrada");
        }

        vaga.setEstadoVaga(Vaga.EstadoVaga.ENCERRADA);
        vaga = vagaRepository.save(vaga);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("vagaId", vaga.getId());
        detalhes.put("titulo", vaga.getTitulo());
        detalhes.put("empresaId", empresa.getId());
        auditoriaService.registrar("EMPRESA_ENCERRAR_SELECAO", "VAGA",
                vaga.getId(), detalhes, httpRequest);

        return VagaResponse.from(vaga, vagaService.podeEditarDiretamente(vaga));
    }

    /**
     * Atualiza o estado da candidatura de um candidato (ex: convocar entrevista, selecionar).
     */
    @Transactional
    public CandidaturaEmpresaResponse atualizarEstadoCandidatura(
            Long vagaId, Long candidaturaId,
            AtualizarEstadoCandidaturaRequest request,
            HttpServletRequest httpRequest) {

        Empresa empresa = empresaDoUsuarioAtual();
        Vaga vaga = vagaRepository.findById(vagaId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada"));

        if (!vaga.getEmpresa().getId().equals(empresa.getId())) {
            throw new BusinessException("Você não tem acesso a esta vaga");
        }

        Candidatura candidatura = candidaturaRepository.findById(candidaturaId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidatura não encontrada"));

        if (!candidatura.getVaga().getId().equals(vaga.getId())) {
            throw new BusinessException("Candidatura não pertence a esta vaga");
        }

        candidatura.setEstado(request.estado());
        if (request.resultado() != null) {
            candidatura.setResultado(request.resultado());
        }

        // Encerramento da candidatura específica
        if (request.estado() == Candidatura.EstadoCandidatura.SELECIONADO
                || request.estado() == Candidatura.EstadoCandidatura.NAO_SELECIONADO
                || request.estado() == Candidatura.EstadoCandidatura.DESISTIU) {
            candidatura.setEncerradaPor(usuarioRepository.getReferenceById(usuarioAtualId()));
            candidatura.setEncerradaEm(DateUtil.agora());
        }

        candidatura = candidaturaRepository.save(candidatura);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("candidaturaId", candidatura.getId());
        detalhes.put("candidatoId", candidatura.getCandidato().getId());
        detalhes.put("novoEstado", request.estado().name());
        auditoriaService.registrar("EMPRESA_ATUALIZAR_CANDIDATURA", "CANDIDATURA",
                candidatura.getId(), detalhes, httpRequest);

        return montarCandidaturaEmpresa(candidatura);
    }

    private CandidaturaEmpresaResponse montarCandidaturaEmpresa(Candidatura c) {
        Long curriculoId = c.getCurriculo().getId();
        List<ExperienciaResponse> exps = experienciaRepository
                .findByCurriculoIdOrderByDataInicioDesc(curriculoId)
                .stream().map(ExperienciaResponse::from).toList();
        List<FormacaoResponse> forms = formacaoRepository
                .findByCurriculoIdOrderByDataInicioDesc(curriculoId)
                .stream().map(FormacaoResponse::from).toList();
        List<CursoLivreResponse> cursos = cursoLivreRepository
                .findByCurriculoIdOrderByAnoConclusaoDesc(curriculoId)
                .stream().map(CursoLivreResponse::from).toList();
        List<AreaResponse> areas = areaInteresseRepository
                .findByCandidatoId(c.getCandidato().getId()).stream()
                .map(ai -> AreaResponse.from(ai.getArea()))
                .toList();
        return CandidaturaEmpresaResponse.from(c, exps, forms, cursos, areas);
    }

    private Empresa empresaDoUsuarioAtual() {
        Long usuarioId = usuarioAtualId();
        return empresaRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new BusinessException("Empresa não associada ao usuário atual"));
    }

    private Long usuarioAtualId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl u) {
            return u.getId();
        }
        throw new BusinessException("Usuário não autenticado");
    }
}