package com.prefeitura.arcoverde.service;

import com.prefeitura.arcoverde.dto.request.RespostaSolicitacaoRequest;
import com.prefeitura.arcoverde.dto.request.SolicitacaoAlteracaoRequest;
import com.prefeitura.arcoverde.dto.request.VagaRequest;
import com.prefeitura.arcoverde.dto.response.SolicitacaoAlteracaoResponse;
import com.prefeitura.arcoverde.exception.BusinessException;
import com.prefeitura.arcoverde.exception.ResourceNotFoundException;
import com.prefeitura.arcoverde.model.SolicitacaoAlteracao;
import com.prefeitura.arcoverde.model.SolicitacaoAlteracao.EstadoSolicitacao;
import com.prefeitura.arcoverde.model.Usuario;
import com.prefeitura.arcoverde.model.Vaga;
import com.prefeitura.arcoverde.model.Empresa;
import com.prefeitura.arcoverde.repository.EmpresaRepository;
import com.prefeitura.arcoverde.repository.SolicitacaoAlteracaoRepository;
import com.prefeitura.arcoverde.repository.UsuarioRepository;
import com.prefeitura.arcoverde.repository.VagaRepository;
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
public class SolicitacaoAlteracaoService {

    private final SolicitacaoAlteracaoRepository repository;
    private final VagaRepository vagaRepository;
    private final EmpresaRepository empresaRepository;
    private final UsuarioRepository usuarioRepository;
    private final VagaService vagaService;
    private final AuditoriaService auditoriaService;

    public SolicitacaoAlteracaoService(SolicitacaoAlteracaoRepository repository,
                                       VagaRepository vagaRepository,
                                       EmpresaRepository empresaRepository,
                                       UsuarioRepository usuarioRepository,
                                       VagaService vagaService,
                                       AuditoriaService auditoriaService) {
        this.repository = repository;
        this.vagaRepository = vagaRepository;
        this.empresaRepository = empresaRepository;
        this.usuarioRepository = usuarioRepository;
        this.vagaService = vagaService;
        this.auditoriaService = auditoriaService;
    }

    /**
     * RF026: Empresa solicita alteração de vaga após 12h.
     */
    @Transactional
    public SolicitacaoAlteracaoResponse solicitar(Long vagaId,
                                                   SolicitacaoAlteracaoRequest request,
                                                   HttpServletRequest httpRequest) {
        Empresa empresa = empresaDoUsuarioAtual();
        Vaga vaga = vagaRepository.findById(vagaId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada"));

        if (!vaga.getEmpresa().getId().equals(empresa.getId())) {
            throw new BusinessException("Você não tem acesso a esta vaga");
        }

        if (vagaService.podeEditarDiretamente(vaga)) {
            throw new BusinessException(
                    "Esta vaga ainda está dentro do período de 12h de edição direta. " +
                    "Use o endpoint de edição em vez de solicitar alteração."
            );
        }

        if (repository.existsByVagaIdAndEstado(vagaId, EstadoSolicitacao.PENDENTE)) {
            throw new BusinessException("Já existe uma solicitação pendente para esta vaga");
        }

        if (vaga.getEstadoVaga() == Vaga.EstadoVaga.CANCELADA
                || vaga.getEstadoVaga() == Vaga.EstadoVaga.ENCERRADA) {
            throw new BusinessException("Não é possível solicitar alteração para vaga encerrada ou cancelada");
        }

        Usuario solicitante = usuarioRepository.getReferenceById(usuarioAtualId());

        SolicitacaoAlteracao solicitacao = SolicitacaoAlteracao.builder()
                .vaga(vaga)
                .solicitante(solicitante)
                .descricao(request.descricao())
                .build();

        solicitacao = repository.save(solicitacao);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("vagaId", vaga.getId());
        detalhes.put("titulo", vaga.getTitulo());
        auditoriaService.registrar("SOLICITAR_ALTERACAO_VAGA", "SOLICITACAO",
                solicitacao.getId(), detalhes, httpRequest);

        return SolicitacaoAlteracaoResponse.from(solicitacao);
    }

    @Transactional(readOnly = true)
    public Page<SolicitacaoAlteracaoResponse> listarMinhasSolicitacoes(Pageable pageable) {
        Long usuarioId = usuarioAtualId();
        return repository.findBySolicitanteIdOrderByCriadoEmDesc(usuarioId, pageable)
                .map(SolicitacaoAlteracaoResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<SolicitacaoAlteracaoResponse> listarTodas(Pageable pageable) {
        return repository.findAllByOrderByCriadoEmDesc(pageable)
                .map(SolicitacaoAlteracaoResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<SolicitacaoAlteracaoResponse> listarPendentes(Pageable pageable) {
        return repository.findByEstadoOrderByCriadoEmDesc(EstadoSolicitacao.PENDENTE, pageable)
                .map(SolicitacaoAlteracaoResponse::from);
    }

    @Transactional(readOnly = true)
    public SolicitacaoAlteracaoResponse buscarPorId(Long id) {
        return SolicitacaoAlteracaoResponse.from(
                repository.findById(id).orElseThrow(
                        () -> new ResourceNotFoundException("Solicitação não encontrada")
                )
        );
    }

    /**
     * ACA/Prefeitura responde à solicitação.
     * Se aprovada: aplica as alterações descritas (neste MVP apenas marca como aprovada
     * e deixa ACA editar manualmente a vaga em seguida).
     */
    @Transactional
    public SolicitacaoAlteracaoResponse responder(Long id,
                                                   RespostaSolicitacaoRequest request,
                                                   HttpServletRequest httpRequest) {
        SolicitacaoAlteracao solicitacao = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        if (solicitacao.getEstado() != EstadoSolicitacao.PENDENTE) {
            throw new BusinessException("Esta solicitação já foi resolvida");
        }

        Usuario resolvedor = usuarioRepository.getReferenceById(usuarioAtualId());
        solicitacao.setResolvidoPor(resolvedor);
        solicitacao.setResolvidoEm(DateUtil.agora());
        solicitacao.setResposta(request.resposta());
        solicitacao.setEstado(Boolean.TRUE.equals(request.aprovar())
                ? EstadoSolicitacao.APROVADA
                : EstadoSolicitacao.REJEITADA);

        solicitacao = repository.save(solicitacao);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("vagaId", solicitacao.getVaga().getId());
        detalhes.put("resposta", solicitacao.getEstado().name());
        auditoriaService.registrar("RESPONDER_SOLICITACAO_VAGA", "SOLICITACAO",
                solicitacao.getId(), detalhes, httpRequest);

        return SolicitacaoAlteracaoResponse.from(solicitacao);
    }

    @Transactional
    public void cancelar(Long id, HttpServletRequest httpRequest) {
        SolicitacaoAlteracao solicitacao = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        if (solicitacao.getEstado() != EstadoSolicitacao.PENDENTE) {
            throw new BusinessException("Apenas solicitações pendentes podem ser canceladas");
        }

        Empresa empresa = empresaDoUsuarioAtual();
        if (!solicitacao.getSolicitante().getId().equals(usuarioAtualId())
                && !solicitacao.getVaga().getEmpresa().getId().equals(empresa.getId())) {
            throw new BusinessException("Você não pode cancelar esta solicitação");
        }

        solicitacao.setEstado(EstadoSolicitacao.CANCELADA);
        solicitacao = repository.save(solicitacao);

        auditoriaService.registrar("CANCELAR_SOLICITACAO", "SOLICITACAO",
                solicitacao.getId(), null, httpRequest);
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