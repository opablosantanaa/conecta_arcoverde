package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.dto.request.LoginRequest;
import com.prefeitura.arcoverde.dto.request.RegistroCandidatoRequest;
import com.prefeitura.arcoverde.dto.response.AuthResponse;
import com.prefeitura.arcoverde.exception.BusinessException;
import com.prefeitura.arcoverde.model.Usuario;
import com.prefeitura.arcoverde.repository.UsuarioRepository;
import com.prefeitura.arcoverde.security.UserDetailsImpl;
import com.prefeitura.arcoverde.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthService authService;
    private final UsuarioRepository usuarioRepository;

    public AuthController(AuthService authService, UsuarioRepository usuarioRepository) {
        this.authService = authService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/registro/candidato")
    public ResponseEntity<AuthResponse> registrarCandidato(@Valid @RequestBody RegistroCandidatoRequest request) {
        return ResponseEntity.ok(authService.registrarCandidato(request));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserDetailsImpl userDetails)) {
            throw new BusinessException("Não autenticado");
        }
        Usuario u = usuarioRepository.findById(userDetails.getId())
                .orElseThrow(() -> new BusinessException("Usuário não encontrado"));

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("usuarioId", u.getId());
        data.put("nome",      u.getNome());
        data.put("email",     u.getEmail());
        data.put("cpf",       u.getCpf());
        data.put("telefone",  u.getTelefone());
        data.put("perfil",    u.getPerfil().name());
        return ResponseEntity.ok(data);
    }
}