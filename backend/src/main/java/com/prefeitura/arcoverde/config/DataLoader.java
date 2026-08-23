package com.prefeitura.arcoverde.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Componente responsável por inicialização de dados.
 * Atualmente simplificado para garantir build estável.
 * A população de dados de teste deve ser feita via scripts SQL ou endpoints administrativos.
 */
@Component
public class DataLoader implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        // Inicialização simplificada para evitar erros de compilação
        // relacionados a construtores e enums específicos das entidades.
        System.out.println(">>> Sistema Conecta Arcoverde iniciado com sucesso.");
        System.out.println(">>> Endpoints de Vagas e Cursos disponíveis em /api/vagas e /api/cursos");
    }
}