package com.prefeitura.arcoverde.service;

import com.prefeitura.arcoverde.dto.request.EsqueciSenhaRequest;
import com.prefeitura.arcoverde.dto.request.RedefinirSenhaRequest;
import com.prefeitura.arcoverde.exception.BusinessException;
import com.prefeitura.arcoverde.model.Usuario;
import com.prefeitura.arcoverde.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * RF004: RecuperaÃ§Ã£o de acesso via e-mail seguro.
 * Armazena tokens em memÃ³ria (MVP). Em produÃ§Ã£o, migrar para tabela dedicada com expiraÃ§Ã£o.
 */
@Service
public class RecuperacaoSenhaService {

    private static final long EXPIRACAO_MS = 60 * 60 * 1000L; // 1 hora
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // token -> TokenInfo (em produÃ§Ã£o usar Redis ou tabela)
    private final Map<String, TokenInfo> tokens = new ConcurrentHashMap<>();

    public RecuperacaoSenhaService(UsuarioRepository usuarioRepository,
                                   PasswordEncoder passwordEncoder,
                                   EmailService emailService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    public void solicitarRedefinicao(EsqueciSenhaRequest request) {
        // SEMPRE retorna sucesso para nÃ£o vazar existÃªncia de e-mails (RN023, LGPD)
        usuarioRepository.findByEmail(request.email()).ifPresent(usuario -> {
            String token = gerarToken();
            tokens.put(token, new TokenInfo(usuario.getId(), Instant.now().plusMillis(EXPIRACAO_MS)));
            emailService.enviarEmailRecuperacaoSenha(usuario.getEmail(), token);
        });
    }

    @Transactional
    public void redefinir(RedefinirSenhaRequest request) {
        TokenInfo info = tokens.get(request.token());
        if (info == null || info.expiraEm().isBefore(Instant.now())) {
            throw new BusinessException("Token invÃ¡lido ou expirado");
        }

        Usuario usuario = usuarioRepository.findById(info.usuarioId())
                .orElseThrow(() -> new BusinessException("UsuÃ¡rio nÃ£o encontrado"));

        usuario.setSenhaHash(passwordEncoder.encode(request.novaSenha()));
        usuarioRepository.save(usuario);

        tokens.remove(request.token());
    }

    private String gerarToken() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private record TokenInfo(Long usuarioId, Instant expiraEm) {}
}