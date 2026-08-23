package com.prefeitura.arcoverde.config;

import com.prefeitura.arcoverde.model.Empresa;
import com.prefeitura.arcoverde.model.Usuario;
import com.prefeitura.arcoverde.model.enums.Perfil;
import com.prefeitura.arcoverde.repository.EmpresaRepository;
import com.prefeitura.arcoverde.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(3)
public class EmpresaSeeder implements CommandLineRunner {

    private final EmpresaRepository empresaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public EmpresaSeeder(EmpresaRepository empresaRepository,
                         UsuarioRepository usuarioRepository,
                         PasswordEncoder passwordEncoder) {
        this.empresaRepository = empresaRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (empresaRepository.count() > 0) return;

        Usuario usuarioEmpresa = usuarioRepository.findByEmail("empresa@conecta.arcoverde")
                .orElseGet(() -> {
                    Usuario u = Usuario.builder()
                            .nome("Empresa Demo")
                            .email("empresa@conecta.arcoverde")
                            .senhaHash(passwordEncoder.encode("Empresa@123"))
                            .perfil(Perfil.EMPRESA)
                            .ativo(true)
                            .build();
                    return usuarioRepository.save(u);
                });

        Empresa empresa = Empresa.builder()
                .usuario(usuarioEmpresa)
                .nomeFantasia("Comércio Arcoverde LTDA")
                .razaoSocial("Comércio Arcoverde Limitada")
                .cnpj("12.345.678/0001-90")
                .emailContato("contato@comercioarcoverde.com")
                .telefone("8738221234")
                .endereco("Rua principal, 100 - Centro, Arcoverde/PE")
                .ocultarNomePublicamente(false)
                .ativo(true)
                .build();

        empresaRepository.save(empresa);
    }
}