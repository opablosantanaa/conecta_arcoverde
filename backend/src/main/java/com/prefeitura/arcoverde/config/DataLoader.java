package com.prefeitura.arcoverde.config;

import com.prefeitura.arcoverde.model.*;
import com.prefeitura.arcoverde.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(UsuarioRepository usuarioRepository,
                                   AreaRepository areaRepository,
                                   VagaRepository vagaRepository,
                                   CursoRepository cursoRepository,
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            System.out.println(">>> Iniciando carregamento de dados...");

            // Criar Usuário Admin se não existir
            if (usuarioRepository.findByEmail("admin@arcoverde.pe.gov.br").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setNome("Administrador Geral");
                admin.setEmail("admin@arcoverde.pe.gov.br");
                admin.setSenhaHash(passwordEncoder.encode("123456"));
                admin.setCpf("000.000.000-00");
                admin.setTipoUsuario(Usuario.TipoUsuario.ADMIN);
                admin.setStatus(Usuario.EstadoUsuario.ATIVO);
                usuarioRepository.save(admin);
                System.out.println("Admin criado!");
            }

            // Criar Áreas
            Area ti = areaRepository.findByNome("Tecnologia");
            if (ti == null) {
                ti = new Area();
                ti.setNome("Tecnologia");
                ti.setDescricao("Vagas e cursos de TI");
                areaRepository.save(ti);
            }

            Area saude = areaRepository.findByNome("Saúde");
            if (saude == null) {
                saude = new Area();
                saude.setNome("Saúde");
                saude.setDescricao("Vagas e cursos da área da saúde");
                areaRepository.save(saude);
            }

            // Criar Vagas (Usando Setters para evitar erro de construtor)
            if (vagaRepository.count() == 0) {
                Vaga vaga1 = new Vaga();
                vaga1.setTitulo("Desenvolvedor Java Pleno");
                vaga1.setDescricao("Vaga para desenvolvimento backend com Spring Boot.");
                vaga1.setLocalizacao("Arcoverde - PE");
                vaga1.setArea(ti);
                vaga1.setSalarioMinimo(new java.math.BigDecimal("5000.00"));
                vaga1.setSalarioMaximo(new java.math.BigDecimal("7000.00"));
                vaga1.setTipoContrato(Vaga.TipoContrato.CLT);
                vaga1.setNumeroVagas(2);
                vaga1.setEstado(Vaga.EstadoVaga.ATIVA);
                vaga1.setDataPublicacao(LocalDateTime.now());
                vagaRepository.save(vaga1);

                Vaga vaga2 = new Vaga();
                vaga2.setTitulo("Enfermeiro Chefe");
                vaga2.setDescricao("Responsável pela unidade básica de saúde.");
                vaga2.setLocalizacao("Arcoverde - PE");
                vaga2.setArea(saude);
                vaga2.setSalarioMinimo(new java.math.BigDecimal("4500.00"));
                vaga2.setSalarioMaximo(new java.math.BigDecimal("6000.00"));
                vaga2.setTipoContrato(Vaga.TipoContrato.ESTATUTARIO);
                vaga2.setNumeroVagas(1);
                vaga2.setEstado(Vaga.EstadoVaga.ATIVA);
                vaga2.setDataPublicacao(LocalDateTime.now());
                vagaRepository.save(vaga2);
                
                System.out.println("Vagas criadas!");
            }

            // Criar Cursos (Usando Setters)
            if (cursoRepository.count() == 0) {
                Curso curso1 = new Curso();
                curso1.setTitulo("Curso de Java Spring Boot");
                curso1.setDescricao("Aprenda a criar APIs robustas.");
                curso1.setInstrutor("João Silva");
                curso1.setArea(ti);
                curso1.setCargaHoraria(40);
                curso1.setDataInicio(LocalDate.now().plusDays(5));
                curso1.setDataFim(LocalDate.now().plusDays(65));
                curso1.setEstado(Curso.EstadoCurso.ABERTO);
                cursoRepository.save(curso1);

                Curso curso2 = new Curso();
                curso2.setTitulo("Primeiros Socorros");
                curso2.setDescricao("Técnicas básicas de salvamento.");
                curso2.setInstrutor("Dra. Maria Oliveira");
                curso2.setArea(saude);
                curso2.setCargaHoraria(20);
                curso2.setDataInicio(LocalDate.now().plusDays(10));
                curso2.setDataFim(LocalDate.now().plusDays(12));
                curso2.setEstado(Curso.EstadoCurso.ABERTO);
                cursoRepository.save(curso2);

                System.out.println("Cursos criados!");
            }

            System.out.println(">>> Dados carregados com sucesso.");
        };
    }
}