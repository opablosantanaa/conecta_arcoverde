package com.prefeitura.arcoverde.config;

import com.prefeitura.arcoverde.model.Vaga;
import com.prefeitura.arcoverde.model.Curso;
import com.prefeitura.arcoverde.repository.VagaRepository;
import com.prefeitura.arcoverde.repository.CursoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner init(VagaRepository vagaRepo, CursoRepository cursoRepo) {
        return args -> {
            if (vagaRepo.count() == 0) {
                vagaRepo.save(new Vaga("Desenvolvedor Junior", "Vaga para iniciantes em Java", "Recife"));
                vagaRepo.save(new Vaga("Analista de Suporte", "Suporte tÃ©cnico nÃ­vel 1", "Arcoverde"));
            }
            if (cursoRepo.count() == 0) {
                cursoRepo.save(new Curso("Curso de Java BÃ¡sico", "Fundamentos da linguagem Java", 40));
                cursoRepo.save(new Curso("Web Design com React", "CriaÃ§Ã£o de interfaces modernas", 60));
            }
        };
    }
}