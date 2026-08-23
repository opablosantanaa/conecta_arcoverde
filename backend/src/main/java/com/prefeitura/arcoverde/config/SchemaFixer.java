package com.prefeitura.arcoverde.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class SchemaFixer implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    public SchemaFixer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        try {
            // Garante que campos opcionais aceitem NULL no banco de dados
            jdbcTemplate.execute("ALTER TABLE experiencias MODIFY COLUMN empresa VARCHAR(150) NULL");
            jdbcTemplate.execute("ALTER TABLE experiencias MODIFY COLUMN cargo VARCHAR(150) NULL");
            jdbcTemplate.execute("ALTER TABLE experiencias MODIFY COLUMN descricao TEXT NULL");
            jdbcTemplate.execute("ALTER TABLE experiencias MODIFY COLUMN data_inicio DATE NULL");
            jdbcTemplate.execute("ALTER TABLE experiencias MODIFY COLUMN data_fim DATE NULL");
            
            jdbcTemplate.execute("ALTER TABLE formacoes MODIFY COLUMN instituicao VARCHAR(200) NULL");
            jdbcTemplate.execute("ALTER TABLE formacoes MODIFY COLUMN curso VARCHAR(200) NULL");
            jdbcTemplate.execute("ALTER TABLE formacoes MODIFY COLUMN nivel VARCHAR(50) NULL");
            jdbcTemplate.execute("ALTER TABLE formacoes MODIFY COLUMN data_inicio DATE NULL");
            jdbcTemplate.execute("ALTER TABLE formacoes MODIFY COLUMN data_fim DATE NULL");
            
            jdbcTemplate.execute("ALTER TABLE cursos_livres MODIFY COLUMN nome VARCHAR(200) NULL");
            jdbcTemplate.execute("ALTER TABLE cursos_livres MODIFY COLUMN instituicao VARCHAR(200) NULL");
            jdbcTemplate.execute("ALTER TABLE cursos_livres MODIFY COLUMN carga_horaria INT NULL");
            jdbcTemplate.execute("ALTER TABLE cursos_livres MODIFY COLUMN ano_conclusao INT NULL");
        } catch (Exception e) {
            // Ignora erros caso a tabela não exista ou o usuário não tenha permissão DDL
        }
    }
}