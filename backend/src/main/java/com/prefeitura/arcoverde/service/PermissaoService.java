package com.prefeitura.arcoverde.service;

import com.prefeitura.arcoverde.dto.request.PermissaoRequest;
import com.prefeitura.arcoverde.dto.response.PermissaoResponse;
import com.prefeitura.arcoverde.exception.ResourceNotFoundException;
import com.prefeitura.arcoverde.model.Permissao;
import com.prefeitura.arcoverde.model.Usuario;
import com.prefeitura.arcoverde.repository.PermissaoRepository;
import com.prefeitura.arcoverde.repository.UsuarioRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class PermissaoService {

    private final PermissaoRepository permissaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final AuditoriaService auditoriaService;

    public PermissaoService(PermissaoRepository permissaoRepository,
                            UsuarioRepository usuarioRepository,
                            AuditoriaService auditoriaService) {
        this.permissaoRepository = permissaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.auditoriaService = auditoriaService;
    }

    @Transactional(readOnly = true)
    public List<PermissaoResponse> listarPorUsuario(Long usuarioId) {
        usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        return permissaoRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(PermissaoResponse::from)
                .toList();
    }

    @Transactional
    public PermissaoResponse salvar(Long usuarioId, PermissaoRequest request, HttpServletRequest httpRequest) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        Permissao permissao = permissaoRepository
                .findByUsuarioIdAndFuncionalidade(usuarioId, request.funcionalidade())
                .orElse(Permissao.builder()
                        .usuario(usuario)
                        .funcionalidade(request.funcionalidade())
                        .build());

        permissao.setPermitido(request.permitido());
        permissao = permissaoRepository.save(permissao);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("usuarioId", usuarioId);
        detalhes.put("funcionalidade", request.funcionalidade());
        detalhes.put("permitido", request.permitido());

        auditoriaService.registrar("SALVAR_PERMISSAO", "PERMISSAO", permissao.getId(), detalhes, httpRequest);

        return PermissaoResponse.from(permissao);
    }

    @Transactional
    public void remover(Long usuarioId, String funcionalidade, HttpServletRequest httpRequest) {
        Permissao permissao = permissaoRepository
                .findByUsuarioIdAndFuncionalidade(usuarioId, funcionalidade)
                .orElseThrow(() -> new ResourceNotFoundException("Permissão não encontrada"));

        permissaoRepository.delete(permissao);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("usuarioId", usuarioId);
        detalhes.put("funcionalidade", funcionalidade);

        auditoriaService.registrar("REMOVER_PERMISSAO", "PERMISSAO", permissao.getId(), detalhes, httpRequest);
    }
}