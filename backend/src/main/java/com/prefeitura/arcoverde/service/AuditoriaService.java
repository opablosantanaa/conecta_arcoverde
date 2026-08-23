package com.prefeitura.arcoverde.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prefeitura.arcoverde.model.Auditoria;
import com.prefeitura.arcoverde.model.Usuario;
import com.prefeitura.arcoverde.repository.AuditoriaRepository;
import com.prefeitura.arcoverde.repository.UsuarioRepository;
import com.prefeitura.arcoverde.security.UserDetailsImpl;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ObjectMapper objectMapper;

    public AuditoriaService(AuditoriaRepository auditoriaRepository,
                            UsuarioRepository usuarioRepository,
                            ObjectMapper objectMapper) {
        this.auditoriaRepository = auditoriaRepository;
        this.usuarioRepository = usuarioRepository;
        this.objectMapper = objectMapper;
    }

    public void registrar(String acao, String entidade, Long entidadeId, Object detalhes, HttpServletRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl userDetails)) {
                return;
            }

            Usuario usuario = usuarioRepository.getReferenceById(userDetails.getId());
            String json = detalhes == null ? null : objectMapper.writeValueAsString(detalhes);

            Auditoria auditoria = Auditoria.builder()
                    .usuario(usuario)
                    .acao(acao)
                    .entidade(entidade)
                    .entidadeId(entidadeId)
                    .detalhes(json)
                    .ipOrigem(extrairIp(request))
                    .build();

            auditoriaRepository.save(auditoria);
        } catch (Exception ignored) {
        }
    }

    private String extrairIp(HttpServletRequest request) {
        if (request == null) return null;

        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }
}