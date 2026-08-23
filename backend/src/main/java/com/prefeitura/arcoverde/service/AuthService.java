package com.prefeitura.arcoverde.service;

import com.prefeitura.arcoverde.dto.request.LoginRequest;
import com.prefeitura.arcoverde.dto.request.RegistroCandidatoRequest;
import com.prefeitura.arcoverde.dto.response.AuthResponse;
import com.prefeitura.arcoverde.exception.BusinessException;
import com.prefeitura.arcoverde.model.Candidato;
import com.prefeitura.arcoverde.model.Usuario;
import com.prefeitura.arcoverde.model.enums.Perfil;
import com.prefeitura.arcoverde.repository.CandidatoRepository;
import com.prefeitura.arcoverde.repository.UsuarioRepository;
import com.prefeitura.arcoverde.security.JwtTokenProvider;
import com.prefeitura.arcoverde.security.UserDetailsImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final CandidatoRepository candidatoRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UsuarioRepository usuarioRepository, CandidatoRepository candidatoRepository,
                       PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.usuarioRepository = usuarioRepository;
        this.candidatoRepository = candidatoRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getSenha())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return new AuthResponse(jwt, "Bearer", userDetails.getId(), userDetails.getPerfil().name());
    }

    @Transactional
    public AuthResponse registrarCandidato(RegistroCandidatoRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Erro: Email já está em uso!");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .senhaHash(passwordEncoder.encode(request.getSenha()))
                .cpf(request.getCpf())
                .telefone(request.getTelefone())
                .perfil(Perfil.CANDIDATO)
                .ativo(true)
                .build();

        usuario = usuarioRepository.save(usuario);

        // Criar entidade Candidato associada
        Candidato candidato = Candidato.builder().usuario(usuario).build();
        candidatoRepository.save(candidato);

        // Gerar Token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSenha())
        );
        String jwt = tokenProvider.generateToken(authentication);
        
        return new AuthResponse(jwt, "Bearer", usuario.getId(), Perfil.CANDIDATO.name());
    }
}