package com.prefeitura.arcoverde.service;

import com.prefeitura.arcoverde.dto.request.ContatoCandidatoRequest;
import com.prefeitura.arcoverde.dto.request.CursoLivreRequest;
import com.prefeitura.arcoverde.dto.request.CurriculoRequest;
import com.prefeitura.arcoverde.dto.request.ExperienciaRequest;
import com.prefeitura.arcoverde.dto.request.FormacaoRequest;
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

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CurriculoService {

    private final CurriculoRepository curriculoRepository;
    private final CandidatoRepository candidatoRepository;
    private final ExperienciaRepository experienciaRepository;
    private final FormacaoRepository formacaoRepository;
    private final CursoLivreRepository cursoLivreRepository;
    private final AreaInteresseRepository areaInteresseRepository;
    private final AreaRepository areaRepository;
    private final UsuarioRepository usuarioRepository;
    private final AuditoriaService auditoriaService;

    public CurriculoService(CurriculoRepository curriculoRepository,
                            CandidatoRepository candidatoRepository,
                            ExperienciaRepository experienciaRepository,
                            FormacaoRepository formacaoRepository,
                            CursoLivreRepository cursoLivreRepository,
                            AreaInteresseRepository areaInteresseRepository,
                            AreaRepository areaRepository,
                            UsuarioRepository usuarioRepository,
                            AuditoriaService auditoriaService) {
        this.curriculoRepository = curriculoRepository;
        this.candidatoRepository = candidatoRepository;
        this.experienciaRepository = experienciaRepository;
        this.formacaoRepository = formacaoRepository;
        this.cursoLivreRepository = cursoLivreRepository;
        this.areaInteresseRepository = areaInteresseRepository;
        this.areaRepository = areaRepository;
        this.usuarioRepository = usuarioRepository;
        this.auditoriaService = auditoriaService;
    }

    @Transactional
    public void atualizarMeuContato(ContatoCandidatoRequest request) {
        Long usuarioId = usuarioAtualId();
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado"));
        
        usuarioRepository.findByEmail(request.email()).ifPresent(existingUser -> {
            if (!existingUser.getId().equals(usuarioId)) {
                throw new BusinessException("Este e-mail ja esta em uso por outro usuario");
            }
        });

        usuario.setEmail(request.email());
        usuario.setTelefone(request.telefone());
        usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public CurriculoResponse buscarMeuCurriculo() {
        Long usuarioId = usuarioAtualId();
        Curriculo curriculo = curriculoRepository.findByCandidatoUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Curriculo nao encontrado"));
        return montarResponse(curriculo);
    }

    @Transactional(readOnly = true)
    public CurriculoResponse buscarPorCandidatoId(Long candidatoId) {
        Curriculo curriculo = curriculoRepository.findByCandidatoId(candidatoId)
                .orElseThrow(() -> new ResourceNotFoundException("Curriculo nao encontrado"));
        return montarResponse(curriculo);
    }

    @Transactional(readOnly = true)
    public Page<CurriculoResponse> listarTodos(Pageable pageable) {
        return curriculoRepository.findAll(pageable).map(this::montarResponse);
    }

    @Transactional(readOnly = true)
    public Page<CurriculoResponse> listarPendentes(Pageable pageable) {
        return curriculoRepository
                .findByEstado(Curriculo.EstadoCurriculo.PENDENTE_VALIDACAO, pageable)
                .map(this::montarResponse);
    }

    @Transactional
    public CurriculoResponse salvarMeuCurriculo(CurriculoRequest request, HttpServletRequest httpRequest) {
        Long usuarioId = usuarioAtualId();
        Candidato candidato = candidatoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidato nao encontrado"));

        Curriculo curriculo = curriculoRepository.findByCandidatoId(candidato.getId())
                .orElse(Curriculo.builder()
                        .candidato(candidato)
                        .estado(Curriculo.EstadoCurriculo.RASCUNHO)
                        .build());

        return salvarInterno(curriculo, request, "SALVAR_CURRICULO_PROPRIO", httpRequest);
    }

    @Transactional
    public CurriculoResponse submeterParaValidacao(HttpServletRequest httpRequest) {
        Long usuarioId = usuarioAtualId();
        Curriculo curriculo = curriculoRepository.findByCandidatoUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Curriculo nao encontrado"));

        if (curriculo.getEstado() == Curriculo.EstadoCurriculo.VALIDADO) {
            throw new BusinessException("Curriculo ja esta validado");
        }

        curriculo.setEstado(Curriculo.EstadoCurriculo.PENDENTE_VALIDACAO);
        curriculo.setMotivoRejeicao(null);
        curriculo = curriculoRepository.save(curriculo);

        auditoriaService.registrar("SUBMETER_CURRICULO", "CURRICULO",
                curriculo.getId(), null, httpRequest);

        return montarResponse(curriculo);
    }

    @Transactional
    public CurriculoResponse validar(Long curriculoId, HttpServletRequest httpRequest) {
        Curriculo curriculo = curriculoRepository.findById(curriculoId)
                .orElseThrow(() -> new ResourceNotFoundException("Curriculo nao encontrado"));

        curriculo.setEstado(Curriculo.EstadoCurriculo.VALIDADO);
        curriculo.setMotivoRejeicao(null);
        curriculo.setValidadoEm(DateUtil.agora());
        curriculo.setValidadoPor(usuarioRepository.getReferenceById(usuarioAtualId()));
        curriculo = curriculoRepository.save(curriculo);

        Map<String, Object> detalhes = Map.of("candidatoId", curriculo.getCandidato().getId());
        auditoriaService.registrar("VALIDAR_CURRICULO", "CURRICULO",
                curriculo.getId(), detalhes, httpRequest);

        return montarResponse(curriculo);
    }

    @Transactional
    public CurriculoResponse rejeitar(Long curriculoId, String motivo, HttpServletRequest httpRequest) {
        if (motivo == null || motivo.isBlank()) {
            throw new BusinessException("Motivo da rejeicao e obrigatorio");
        }
        Curriculo curriculo = curriculoRepository.findById(curriculoId)
                .orElseThrow(() -> new ResourceNotFoundException("Curriculo nao encontrado"));

        curriculo.setEstado(Curriculo.EstadoCurriculo.REJEITADO);
        curriculo.setMotivoRejeicao(motivo);
        curriculo.setValidadoEm(DateUtil.agora());
        curriculo.setValidadoPor(usuarioRepository.getReferenceById(usuarioAtualId()));
        curriculo = curriculoRepository.save(curriculo);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("candidatoId", curriculo.getCandidato().getId());
        detalhes.put("motivo", motivo);
        auditoriaService.registrar("REJEITAR_CURRICULO", "CURRICULO",
                curriculo.getId(), detalhes, httpRequest);

        return montarResponse(curriculo);
    }

    private CurriculoResponse salvarInterno(Curriculo curriculo, CurriculoRequest request,
                                            String acaoAuditoria, HttpServletRequest httpRequest) {
        curriculo.setObjetivo(request.objetivo());
        curriculo.setResumoProfissional(request.resumoProfissional());

        // Se ja estava VALIDADO e o usuario esta editando, volta para rascunho
        if (curriculo.getEstado() == Curriculo.EstadoCurriculo.VALIDADO) {
            curriculo.setEstado(Curriculo.EstadoCurriculo.RASCUNHO);
            curriculo.setValidadoPor(null);
            curriculo.setValidadoEm(null);
            curriculo.setMotivoRejeicao(null);
        }

        // Variavel final para ser usada nas lambdas abaixo
        final Curriculo curriculoSalvo = curriculoRepository.save(curriculo);
        curriculoRepository.flush();

        // Experiencias
        experienciaRepository.deleteByCurriculoId(curriculoSalvo.getId());
        experienciaRepository.flush();
        List<Experiencia> exps = request.experiencias().stream().map(r -> Experiencia.builder()
                .curriculo(curriculoSalvo)
                .empresa(r.empresa())
                .cargo(r.cargo())
                .descricao(r.descricao())
                .dataInicio(r.dataInicio())
                .dataFim(r.dataFim())
                .atual(Boolean.TRUE.equals(r.atual()))
                .build()).toList();
        experienciaRepository.saveAll(exps);

        // Formacoes
        formacaoRepository.deleteByCurriculoId(curriculoSalvo.getId());
        formacaoRepository.flush();
        List<Formacao> forms = request.formacoes().stream().map(r -> Formacao.builder()
                .curriculo(curriculoSalvo)
                .instituicao(r.instituicao())
                .curso(r.curso())
                .nivel(r.nivel())
                .dataInicio(r.dataInicio())
                .dataFim(r.dataFim())
                .concluido(Boolean.TRUE.equals(r.concluido()))
                .build()).toList();
        formacaoRepository.saveAll(forms);

        // Cursos livres
        cursoLivreRepository.deleteByCurriculoId(curriculoSalvo.getId());
        cursoLivreRepository.flush();
        List<CursoLivre> cursos = request.cursosLivres().stream().map(r -> CursoLivre.builder()
                .curriculo(curriculoSalvo)
                .nome(r.nome())
                .instituicao(r.instituicao())
                .cargaHoraria(r.cargaHoraria())
                .anoConclusao(r.anoConclusao())
                .build()).toList();
        cursoLivreRepository.saveAll(cursos);

        // Areas de interesse (CORRECAO: flush imediato e distinct)
        areaInteresseRepository.deleteByCandidatoId(curriculoSalvo.getCandidato().getId());
        areaInteresseRepository.flush(); // CRITICO: Forca o DELETE no banco antes do INSERT
        
        if (!request.areasInteresseIds().isEmpty()) {
            List<Long> idsDistintos = request.areasInteresseIds().stream().distinct().toList();
            List<Area> areas = areaRepository.findAllById(idsDistintos);
            List<AreaInteresse> interesses = areas.stream().map(a -> AreaInteresse.builder()
                    .candidato(curriculoSalvo.getCandidato())
                    .area(a)
                    .build()).toList();
            areaInteresseRepository.saveAll(interesses);
        }

        auditoriaService.registrar(acaoAuditoria, "CURRICULO",
                curriculoSalvo.getId(), null, httpRequest);

        return montarResponse(curriculoSalvo);
    }

    private CurriculoResponse montarResponse(Curriculo c) {
        List<ExperienciaResponse> exps = experienciaRepository
                .findByCurriculoIdOrderByDataInicioDesc(c.getId())
                .stream().map(ExperienciaResponse::from).toList();
        List<FormacaoResponse> forms = formacaoRepository
                .findByCurriculoIdOrderByDataInicioDesc(c.getId())
                .stream().map(FormacaoResponse::from).toList();
        List<CursoLivreResponse> cursos = cursoLivreRepository
                .findByCurriculoIdOrderByAnoConclusaoDesc(c.getId())
                .stream().map(CursoLivreResponse::from).toList();
        List<AreaResponse> areas = areaInteresseRepository
                .findByCandidatoId(c.getCandidato().getId()).stream()
                .map(ai -> AreaResponse.from(ai.getArea()))
                .toList();
        return CurriculoResponse.from(c, exps, forms, cursos, areas);
    }

    private Long usuarioAtualId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl u) {
            return u.getId();
        }
        throw new BusinessException("Usuario nao autenticado");
    }
}