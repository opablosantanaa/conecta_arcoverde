package com.prefeitura.arcoverde.service;

import com.prefeitura.arcoverde.dto.request.CursoRequest;
import com.prefeitura.arcoverde.dto.response.CursoResponse;
import com.prefeitura.arcoverde.exception.BusinessException;
import com.prefeitura.arcoverde.exception.ResourceNotFoundException;
import com.prefeitura.arcoverde.model.Area;
import com.prefeitura.arcoverde.model.Curso;
import com.prefeitura.arcoverde.model.Curso.EstadoCurso;
import com.prefeitura.arcoverde.model.Usuario;
import com.prefeitura.arcoverde.repository.AreaRepository;
import com.prefeitura.arcoverde.repository.CursoRepository;
import com.prefeitura.arcoverde.repository.UsuarioRepository;
import com.prefeitura.arcoverde.security.UserDetailsImpl;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class CursoService {

    private final CursoRepository cursoRepository;
    private final AreaRepository areaRepository;
    private final UsuarioRepository usuarioRepository;
    private final AuditoriaService auditoriaService;

    public CursoService(CursoRepository cursoRepository,
                        AreaRepository areaRepository,
                        UsuarioRepository usuarioRepository,
                        AuditoriaService auditoriaService) {
        this.cursoRepository = cursoRepository;
        this.areaRepository = areaRepository;
        this.usuarioRepository = usuarioRepository;
        this.auditoriaService = auditoriaService;
    }

    @Transactional(readOnly = true)
    public Page<CursoResponse> listarTodos(Pageable pageable) {
        return cursoRepository.findAll(pageable).map(c -> CursoResponse.from(c, estaExpirado(c)));
    }

    @Transactional(readOnly = true)
    public Page<CursoResponse> listarAtivos(Pageable pageable) {
        return cursoRepository.findByEstado(EstadoCurso.ATIVO, pageable)
                .map(c -> CursoResponse.from(c, estaExpirado(c)));
    }

    /**
     * RN060: Cursos expiram automaticamente após dataFim.
     * A query do repositório já filtra os cursos ativos e dentro do período válido.
     */
    @Transactional(readOnly = true)
    public Page<CursoResponse> buscarPublico(String titulo, Long areaId, Pageable pageable) {
        return cursoRepository.buscarPublico(
                        EstadoCurso.ATIVO,
                        titulo,
                        areaId,
                        LocalDate.now(),
                        pageable)
                .map(c -> CursoResponse.from(c, false));
    }

    @Transactional(readOnly = true)
    public CursoResponse buscarPorId(Long id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curso não encontrado"));
        return CursoResponse.from(curso, estaExpirado(curso));
    }

    @Transactional
    public CursoResponse criar(CursoRequest request, HttpServletRequest httpRequest) {
        validarPeriodo(request.dataInicio(), request.dataFim());
        Usuario usuario = usuarioAtual();

        Curso curso = Curso.builder()
                .titulo(request.titulo())
                .descricao(request.descricao())
                .instituicao(request.instituicao())
                .area(buscarArea(request.areaId()))
                .linkInscricao(request.linkInscricao())
                .linkPlataforma(request.linkPlataforma())
                .cargaHoraria(request.cargaHoraria())
                .dataInicio(request.dataInicio())
                .dataFim(request.dataFim())
                .estado(EstadoCurso.ATIVO)
                .cadastradoPor(usuario)
                .build();

        curso = cursoRepository.save(curso);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("titulo", curso.getTitulo());
        auditoriaService.registrar("CRIAR_CURSO", "CURSO", curso.getId(), detalhes, httpRequest);

        return CursoResponse.from(curso, estaExpirado(curso));
    }

    @Transactional
    public CursoResponse atualizar(Long id, CursoRequest request, HttpServletRequest httpRequest) {
        validarPeriodo(request.dataInicio(), request.dataFim());
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curso não encontrado"));

        curso.setTitulo(request.titulo());
        curso.setDescricao(request.descricao());
        curso.setInstituicao(request.instituicao());
        curso.setArea(buscarArea(request.areaId()));
        curso.setLinkInscricao(request.linkInscricao());
        curso.setLinkPlataforma(request.linkPlataforma());
        curso.setCargaHoraria(request.cargaHoraria());
        curso.setDataInicio(request.dataInicio());
        curso.setDataFim(request.dataFim());

        curso = cursoRepository.save(curso);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("titulo", curso.getTitulo());
        auditoriaService.registrar("ATUALIZAR_CURSO", "CURSO", curso.getId(), detalhes, httpRequest);

        return CursoResponse.from(curso, estaExpirado(curso));
    }

    @Transactional
    public CursoResponse desativar(Long id, HttpServletRequest httpRequest) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curso não encontrado"));
        curso.setEstado(EstadoCurso.INATIVO);
        curso = cursoRepository.save(curso);

        auditoriaService.registrar("DESATIVAR_CURSO", "CURSO", curso.getId(),
                Map.of("titulo", curso.getTitulo()), httpRequest);

        return CursoResponse.from(curso, estaExpirado(curso));
    }

    private boolean estaExpirado(Curso curso) {
        return curso.getDataFim() != null && curso.getDataFim().isBefore(LocalDate.now());
    }

    private void validarPeriodo(LocalDate inicio, LocalDate fim) {
        if (inicio != null && fim != null && fim.isBefore(inicio)) {
            throw new BusinessException("Data de fim deve ser posterior à data de início");
        }
    }

    private Area buscarArea(Long areaId) {
        if (areaId == null) return null;
        return areaRepository.findById(areaId)
                .orElseThrow(() -> new ResourceNotFoundException("Área não encontrada"));
    }

    private Usuario usuarioAtual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl u) {
            return usuarioRepository.getReferenceById(u.getId());
        }
        throw new BusinessException("Usuário não autenticado");
    }
}