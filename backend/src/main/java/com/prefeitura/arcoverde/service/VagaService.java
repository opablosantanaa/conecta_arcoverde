package com.prefeitura.arcoverde.service;

import com.prefeitura.arcoverde.dto.request.AprovacaoVagaRequest;
import com.prefeitura.arcoverde.dto.request.VagaRequest;
import com.prefeitura.arcoverde.dto.response.VagaResponse;
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

import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class VagaService {

    private static final long HORAS_EDICAO_DIRETA = 12L;

    private final VagaRepository vagaRepository;
    private final EmpresaRepository empresaRepository;
    private final AreaRepository areaRepository;
    private final UsuarioRepository usuarioRepository;
    private final AuditoriaService auditoriaService;

    public VagaService(VagaRepository vagaRepository,
                       EmpresaRepository empresaRepository,
                       AreaRepository areaRepository,
                       UsuarioRepository usuarioRepository,
                       AuditoriaService auditoriaService) {
        this.vagaRepository = vagaRepository;
        this.empresaRepository = empresaRepository;
        this.areaRepository = areaRepository;
        this.usuarioRepository = usuarioRepository;
        this.auditoriaService = auditoriaService;
    }

    @Transactional(readOnly = true)
    public Page<VagaResponse> listarTodas(Pageable pageable) {
        return vagaRepository.findAll(pageable).map(v -> VagaResponse.from(v, podeEditarDiretamente(v)));
    }

    @Transactional(readOnly = true)
    public Page<VagaResponse> listarPorEstado(Vaga.EstadoVaga estado, Pageable pageable) {
        return vagaRepository.findByEstadoVaga(estado, pageable)
                .map(v -> VagaResponse.from(v, podeEditarDiretamente(v)));
    }

    @Transactional(readOnly = true)
    public VagaResponse buscarPorId(Long id) {
        Vaga vaga = vagaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada"));
        return VagaResponse.from(vaga, podeEditarDiretamente(vaga));
    }

    @Transactional
    public VagaResponse criar(VagaRequest request, HttpServletRequest httpRequest) {
        Empresa empresa = empresaRepository.findById(request.empresaId())
                .orElseThrow(() -> new ResourceNotFoundException("Empresa não encontrada"));
        Area area = areaRepository.findById(request.areaId())
                .orElseThrow(() -> new ResourceNotFoundException("Área não encontrada"));
        Usuario usuarioAtual = usuarioAtual();

        Vaga vaga = Vaga.builder()
                .titulo(request.titulo())
                .descricao(request.descricao())
                .empresa(empresa)
                .area(area)
                .requisitos(request.requisitos())
                .beneficios(request.beneficios())
                .salarioMinimo(request.salarioMinimo())
                .salarioMaximo(request.salarioMaximo())
                .tipoContrato(request.tipoContrato())
                .quantidadeVagas(request.quantidadeVagas() != null ? request.quantidadeVagas() : 1)
                .cidade(request.cidade() != null ? request.cidade() : "Arcoverde")
                .estado(request.estado() != null ? request.estado() : "PE")
                .estadoVaga(Vaga.EstadoVaga.AGUARDANDO_APROVACAO)
                .cadastradaPor(usuarioAtual)
                .build();

        vaga = vagaRepository.save(vaga);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("titulo", vaga.getTitulo());
        detalhes.put("empresaId", empresa.getId());
        detalhes.put("estado", vaga.getEstadoVaga().name());
        auditoriaService.registrar("CRIAR_VAGA", "VAGA", vaga.getId(), detalhes, httpRequest);

        return VagaResponse.from(vaga, podeEditarDiretamente(vaga));
    }

    @Transactional
    public VagaResponse atualizar(Long id, VagaRequest request, HttpServletRequest httpRequest) {
        Vaga vaga = vagaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada"));

        Empresa empresa = empresaRepository.findById(request.empresaId())
                .orElseThrow(() -> new ResourceNotFoundException("Empresa não encontrada"));
        Area area = areaRepository.findById(request.areaId())
                .orElseThrow(() -> new ResourceNotFoundException("Área não encontrada"));

        Usuario usuarioAtual = usuarioAtual();

        // Se for EMPRESA, valida a regra das 12h
        if (usuarioAtual.getPerfil() == com.prefeitura.arcoverde.model.enums.Perfil.EMPRESA) {
            Empresa empresaDoUsuario = empresaRepository.findByUsuarioId(usuarioAtual.getId())
                    .orElseThrow(() -> new BusinessException("Empresa do usuário não encontrada"));
            if (!empresaDoUsuario.getId().equals(vaga.getEmpresa().getId())) {
                throw new BusinessException("Você só pode editar vagas da sua própria empresa");
            }
            if (!podeEditarDiretamente(vaga)) {
                throw new BusinessException("Edição direta permitida apenas nas primeiras " + HORAS_EDICAO_DIRETA + " horas após o cadastro. Solicite alteração à ACA/Prefeitura.");
            }
        }

        vaga.setTitulo(request.titulo());
        vaga.setDescricao(request.descricao());
        vaga.setEmpresa(empresa);
        vaga.setArea(area);
        vaga.setRequisitos(request.requisitos());
        vaga.setBeneficios(request.beneficios());
        vaga.setSalarioMinimo(request.salarioMinimo());
        vaga.setSalarioMaximo(request.salarioMaximo());
        vaga.setTipoContrato(request.tipoContrato());
        if (request.quantidadeVagas() != null) vaga.setQuantidadeVagas(request.quantidadeVagas());
        if (request.cidade() != null) vaga.setCidade(request.cidade());
        if (request.estado() != null) vaga.setEstado(request.estado());

        // Se a vaga já estava PUBLICADA e foi editada por ACA/Prefeitura, volta para revalidação
        if (vaga.getEstadoVaga() == Vaga.EstadoVaga.PUBLICADA
                && usuarioAtual.getPerfil() != com.prefeitura.arcoverde.model.enums.Perfil.EMPRESA) {
            vaga.setEstadoVaga(Vaga.EstadoVaga.AGUARDANDO_APROVACAO);
            vaga.setAprovadaPor(null);
            vaga.setAprovadaEm(null);
        }

        vaga = vagaRepository.save(vaga);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("titulo", vaga.getTitulo());
        detalhes.put("empresaId", empresa.getId());
        auditoriaService.registrar("ATUALIZAR_VAGA", "VAGA", vaga.getId(), detalhes, httpRequest);

        return VagaResponse.from(vaga, podeEditarDiretamente(vaga));
    }

    @Transactional
    public VagaResponse aprovarOuRejeitar(Long id, AprovacaoVagaRequest request, HttpServletRequest httpRequest) {
        Vaga vaga = vagaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada"));

        if (vaga.getEstadoVaga() != Vaga.EstadoVaga.AGUARDANDO_APROVACAO) {
            throw new BusinessException("Esta vaga não está aguardando aprovação");
        }

        Usuario usuarioAtual = usuarioAtual();

        if (Boolean.TRUE.equals(request.aprovar())) {
            vaga.setEstadoVaga(Vaga.EstadoVaga.APROVADA);
            vaga.setAprovadaPor(usuarioAtual);
            vaga.setAprovadaEm(DateUtil.agora());

            auditoriaService.registrar("APROVAR_VAGA", "VAGA", vaga.getId(),
                    Map.of("titulo", vaga.getTitulo()), httpRequest);
        } else {
            if (request.motivo() == null || request.motivo().isBlank()) {
                throw new BusinessException("Motivo é obrigatório para rejeitar vaga");
            }
            vaga.setEstadoVaga(Vaga.EstadoVaga.CANCELADA);
            Map<String, Object> detalhes = new LinkedHashMap<>();
            detalhes.put("titulo", vaga.getTitulo());
            detalhes.put("motivo", request.motivo());
            auditoriaService.registrar("REJEITAR_VAGA", "VAGA", vaga.getId(), detalhes, httpRequest);
        }

        vaga = vagaRepository.save(vaga);
        return VagaResponse.from(vaga, podeEditarDiretamente(vaga));
    }

    @Transactional
    public VagaResponse publicar(Long id, HttpServletRequest httpRequest) {
        Vaga vaga = vagaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada"));

        if (vaga.getEstadoVaga() != Vaga.EstadoVaga.APROVADA) {
            throw new BusinessException("Apenas vagas aprovadas podem ser publicadas");
        }

        vaga.setEstadoVaga(Vaga.EstadoVaga.PUBLICADA);
        vaga = vagaRepository.save(vaga);

        auditoriaService.registrar("PUBLICAR_VAGA", "VAGA", vaga.getId(),
                Map.of("titulo", vaga.getTitulo()), httpRequest);

        return VagaResponse.from(vaga, podeEditarDiretamente(vaga));
    }

    @Transactional
    public VagaResponse encerrar(Long id, HttpServletRequest httpRequest) {
        Vaga vaga = vagaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada"));

        if (vaga.getEstadoVaga() != Vaga.EstadoVaga.PUBLICADA
                && vaga.getEstadoVaga() != Vaga.EstadoVaga.APROVADA) {
            throw new BusinessException("Apenas vagas publicadas ou aprovadas podem ser encerradas");
        }

        vaga.setEstadoVaga(Vaga.EstadoVaga.ENCERRADA);
        vaga = vagaRepository.save(vaga);

        auditoriaService.registrar("ENCERRAR_VAGA", "VAGA", vaga.getId(),
                Map.of("titulo", vaga.getTitulo()), httpRequest);

        return VagaResponse.from(vaga, podeEditarDiretamente(vaga));
    }

    @Transactional
    public VagaResponse cancelar(Long id, HttpServletRequest httpRequest) {
        Vaga vaga = vagaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada"));

        vaga.setEstadoVaga(Vaga.EstadoVaga.CANCELADA);
        vaga = vagaRepository.save(vaga);

        auditoriaService.registrar("CANCELAR_VAGA", "VAGA", vaga.getId(),
                Map.of("titulo", vaga.getTitulo()), httpRequest);

        return VagaResponse.from(vaga, podeEditarDiretamente(vaga));
    }

    /**
     * RN033-RN037: Regra das 12 horas
     * A empresa pode editar diretamente apenas nas primeiras 12h após o cadastro.
     * Usa o fuso America/Recife conforme RNF058-RNF059.
     */
    public boolean podeEditarDiretamente(Vaga vaga) {
        if (vaga.getCriadoEm() == null) return false;
        Duration decorrido = Duration.between(vaga.getCriadoEm(), DateUtil.agora());
        return decorrido.toHours() < HORAS_EDICAO_DIRETA;
    }

    private Usuario usuarioAtual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl u) {
            return usuarioRepository.getReferenceById(u.getId());
        }
        throw new BusinessException("Usuário não autenticado");
    }
}