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
        criarUsuarioSeNaoExistir("Administrador", "admin@conecta.arcoverde", "Admin@123", Perfil.ADMIN);
        criarUsuarioSeNaoExistir("Prefeitura", "prefeitura@conecta.arcoverde", "Prefeitura@123", Perfil.PREFEITURA);
        criarUsuarioSeNaoExistir("ACA", "aca@conecta.arcoverde", "Aca@1234", Perfil.ACA);
        criarUsuarioSeNaoExistir("Empresa Demo", "empresa@conecta.arcoverde", "Empresa@123", Perfil.EMPRESA);
    }

    private void criarUsuarioSeNaoExistir(String nome, String email, String senha, Perfil perfil) {
        // Verifica se o usuário já existe no banco
        boolean existe = usuarioRepository.findByEmail(email).isPresent();

        if (!existe) {
            Usuario usuario = Usuario.builder()
                    .nome(nome)
                    .email(email)
                    .senhaHash(passwordEncoder.encode(senha))
                    .perfil(perfil)
                    .ativo(true)
                    .build();
            usuarioRepository.save(usuario);
        }
    }
}