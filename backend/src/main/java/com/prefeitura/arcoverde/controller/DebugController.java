package com.prefeitura.arcoverde.controller;

import com.prefeitura.arcoverde.model.Usuario;
import com.prefeitura.arcoverde.model.enums.Perfil;
import com.prefeitura.arcoverde.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DebugController(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/seed")
    public ResponseEntity<Map<String, Object>> criarUsuariosSeed() {
        Map<String, Object> response = new HashMap<>();
        
        if (usuarioRepository.count() > 0) {
            response.put("status", "skip");
            response.put("message", "Usuários já existem no banco");
            return ResponseEntity.ok(response);
        }

        criarUsuario("Administrador", "admin@conecta.arcoverde", "Admin@123", Perfil.ADMIN);
        criarUsuario("Prefeitura", "prefeitura@conecta.arcoverde", "Prefeitura@123", Perfil.PREFEITURA);
        criarUsuario("ACA", "aca@conecta.arcoverde", "Aca@1234", Perfil.ACA);
        criarUsuario("Empresa Teste", "empresa@conecta.arcoverde", "Empresa@123", Perfil.EMPRESA);

        response.put("status", "success");
        response.put("message", "4 usuários criados com sucesso");
        response.put("usuarios", new String[]{
            "admin@conecta.arcoverde / Admin@123",
            "prefeitura@conecta.arcoverde / Prefeitura@123",
            "aca@conecta.arcoverde / Aca@1234",
            "empresa@conecta.arcoverde / Empresa@123"
        });

        return ResponseEntity.ok(response);
    }

    private void criarUsuario(String nome, String email, String senha, Perfil perfil) {
        Usuario usuario = new Usuario();
        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setSenhaHash(passwordEncoder.encode(senha));
        usuario.setPerfil(perfil);
        usuario.setAtivo(true);
        usuario.setCriadoEm(LocalDateTime.now());
        usuarioRepository.save(usuario);
    }
}
