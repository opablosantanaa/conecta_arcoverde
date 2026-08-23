package com.prefeitura.arcoverde.config;

import com.prefeitura.arcoverde.model.Vaga;
import com.prefeitura.arcoverde.model.Curso;
import com.prefeitura.arcoverde.repository.VagaRepository;
import com.prefeitura.arcoverde.repository.CursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private VagaRepository vagaRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Override
    public void run(String... args) {
        if (vagaRepository.count() == 0) {
            System.out.println("Populando banco com vagas de exemplo...");
            vagaRepository.save(new Vaga(null, "Desenvolvedor Java Júnior", "Empresa Tech LTDA", "Remoto", "CLT", true));
            vagaRepository.save(new Vaga(null, "Analista de Suporte", "Prefeitura de Arcoverde", "Arcoverde - PE", "Estágio", true));
            vagaRepository.save(new Vaga(null, "Eletricista Predial", "Construtora Silva", "Arcoverde - PE", "Contrato Temporário", false));
        }

        if (cursoRepository.count() == 0) {
            System.out.println("Populando banco com cursos de exemplo...");
            cursoRepository.save(new Curso(null, "Introdução à Programação Web", "SENAI", "40h", "Online", true));
            cursoRepository.save(new Curso(null, "Excel Avançado para Negócios", "Fundação Bradesco", "20h", "Presencial", true));
            cursoRepository.save(new Curso(null, "Auxiliar Administrativo", "Prefeitura de Arcoverde", "60h", "Presencial", false));
        }
    }
}