package com.prefeitura.arcoverde.service;

import com.prefeitura.arcoverde.dto.request.UsuarioAdminRequest;
import com.prefeitura.arcoverde.dto.response.UsuarioAdminResponse;
import com.prefeitura.arcoverde.exception.BusinessException;
import com.prefeitura.arcoverde.exception.ResourceNotFoundException;
import com.prefeitura.arcoverde.model.Usuario;
import com.prefeitura.arcoverde.model.enums.Perfil;
import com.prefeitura.arcoverde.repository.UsuarioRepository;
import com.prefeitura.arcoverde.security.UserDetailsImpl;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class AdminUserService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditoriaService auditoriaService;

    public AdminUserService(UsuarioRepository usuarioRepository,
                            PasswordEncoder passwordEncoder,
                            AuditoriaService auditoriaService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditoriaService = auditoriaService;
    }

    @Transactional(readOnly = true)
    public Page<UsuarioAdminResponse> listar(Pageable pageable) {
        return usuarioRepository.findAll(pageable).map(UsuarioAdminResponse::from);
    }

    @Transactional(readOnly = true)
    public UsuarioAdminResponse buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        return UsuarioAdminResponse.from(usuario);
    }

    @Transactional
    public UsuarioAdminResponse criar(UsuarioAdminRequest request, HttpServletRequest httpRequest) {
        validarPerfil(request.perfil());

        if (usuarioRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email já está em uso");
        }

        String cpf = normalizarCpf(request.cpf());
        if (cpf != null && usuarioRepository.existsByCpf(cpf)) {
            throw new BusinessException("CPF já está em uso");
        }

        if (request.senha() == null || request.senha().isBlank()) {
            throw new BusinessException("Senha é obrigatória para criar usuário");
        }

        if (request.senha().length() < 8) {
            throw new BusinessException("Senha deve ter no mínimo 8 caracteres");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.nome())
                .email(request.email())
                .senhaHash(passwordEncoder.encode(request.senha()))
                .cpf(cpf)
                .telefone(request.telefone())
                .perfil(request.perfil())
                .ativo(request.ativo() == null ? Boolean.TRUE : request.ativo())
                .build();

        usuario = usuarioRepository.save(usuario);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("email", usuario.getEmail());
        detalhes.put("perfil", usuario.getPerfil().name());
        detalhes.put("ativo", usuario.getAtivo());

        auditoriaService.registrar("CRIAR_USUARIO", "USUARIO", usuario.getId(), detalhes, httpRequest);

        return UsuarioAdminResponse.from(usuario);
    }

    @Transactional
    public UsuarioAdminResponse atualizar(Long id, UsuarioAdminRequest request, HttpServletRequest httpRequest) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        validarPerfil(request.perfil());

        if (!usuario.getEmail().equalsIgnoreCase(request.email()) && usuarioRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email já está em uso");
        }

        String cpf = normalizarCpf(request.cpf());
        if (cpf != null && !cpf.equals(usuario.getCpf()) && usuarioRepository.existsByCpf(cpf)) {
            throw new BusinessException("CPF já está em uso");
        }

        validarUltimoAdmin(usuario, request.perfil(), request.ativo());

        usuario.setNome(request.nome());
        usuario.setEmail(request.email());
        usuario.setCpf(cpf);
        usuario.setTelefone(request.telefone());
        usuario.setPerfil(request.perfil());

        if (request.ativo() != null) {
            if (!request.ativo() && id.equals(usuarioAtualId())) {
                throw new BusinessException("Não é possível desativar o próprio usuário");
            }
            usuario.setAtivo(request.ativo());
        }

        if (request.senha() != null && !request.senha().isBlank()) {
            if (request.senha().length() < 8) {
                throw new BusinessException("Senha deve ter no mínimo 8 caracteres");
            }
            usuario.setSenhaHash(passwordEncoder.encode(request.senha()));
        }

        usuario = usuarioRepository.save(usuario);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("email", usuario.getEmail());
        detalhes.put("perfil", usuario.getPerfil().name());
        detalhes.put("ativo", usuario.getAtivo());

        auditoriaService.registrar("ATUALIZAR_USUARIO", "USUARIO", usuario.getId(), detalhes, httpRequest);

        return UsuarioAdminResponse.from(usuario);
    }

    @Transactional
    public void desativar(Long id, HttpServletRequest httpRequest) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        if (id.equals(usuarioAtualId())) {
            throw new BusinessException("Não é possível desativar o próprio usuário");
        }

        validarUltimoAdmin(usuario, usuario.getPerfil(), Boolean.FALSE);

        usuario.setAtivo(false);
        usuarioRepository.save(usuario);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("email", usuario.getEmail());
        detalhes.put("perfil", usuario.getPerfil().name());

        auditoriaService.registrar("DESATIVAR_USUARIO", "USUARIO", usuario.getId(), detalhes, httpRequest);
    }

    private void validarPerfil(Perfil perfil) {
        if (perfil == null) {
            throw new BusinessException("Perfil é obrigatório");
        }

        if (perfil == Perfil.CANDIDATO) {
            throw new BusinessException("Candidatos não devem ser gerenciados por este endpoint administrativo");
        }
    }

    private void validarUltimoAdmin(Usuario usuario, Perfil novoPerfil, Boolean novoAtivo) {
        if (usuario.getPerfil() != Perfil.ADMIN || !Boolean.TRUE.equals(usuario.getAtivo())) {
            return;
        }

        boolean perdeStatusAdmin = novoPerfil != Perfil.ADMIN;
        boolean ficaInativo = novoAtivo != null && !novoAtivo;

        if ((perdeStatusAdmin || ficaInativo) && usuarioRepository.countByPerfilAndAtivoTrue(Perfil.ADMIN) == 1) {
            throw new BusinessException("Não é possível remover ou desativar o último ADMIN ativo");
        }
    }

    private Long usuarioAtualId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl userDetails) {
            return userDetails.getId();
        }

        return null;
    }

    private String normalizarCpf(String cpf) {
        if (cpf == null || cpf.isBlank()) {
            return null;
        }
        return cpf.trim();
    }
}