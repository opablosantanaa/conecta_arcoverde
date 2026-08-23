package com.prefeitura.arcoverde.config;

import com.prefeitura.arcoverde.model.Usuario;
import com.prefeitura.arcoverde.model.enums.Perfil;
import com.prefeitura.arcoverde.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(1)
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UsuarioRepository usuarioRepository,
                      PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        upsertUsuario("Administrador", "admin@conecta.arcoverde", "Admin@123", Perfil.ADMIN);
        upsertUsuario("Prefeitura", "prefeitura@conecta.arcoverde", "Prefeitura@123", Perfil.PREFEITURA);
        upsertUsuario("ACA", "aca@conecta.arcoverde", "Aca@1234", Perfil.ACA);
        upsertUsuario("Empresa Demo", "empresa@conecta.arcoverde", "Empresa@123", Perfil.EMPRESA);
    }

    private void upsertUsuario(String nome, String email, String senha, Perfil perfil) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseGet(() -> Usuario.builder()
                        .email(email)
                        .build());

        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setSenhaHash(passwordEncoder.encode(senha));
        usuario.setPerfil(perfil);
        usuario.setAtivo(true);

        usuarioRepository.save(usuario);
    }
}