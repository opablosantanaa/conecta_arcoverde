package com.prefeitura.arcoverde.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class HikariConfig {

    private static final Logger logger = LoggerFactory.getLogger(HikariConfig.class);

    @Value("${spring.datasource.url}")
    private String jdbcUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        logger.info("========================================");
        logger.info("Inicializando HikariCP DataSource");
        logger.info("URL: {}", jdbcUrl);
        logger.info("Username: {}", username);
        logger.info("========================================");

        com.zaxxer.hikari.HikariConfig config = new com.zaxxer.hikari.HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        
        // Pool settings
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(60000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);
        config.setValidationTimeout(5000);
        config.setInitializationFailTimeout(0);
        config.setConnectionTestQuery("SELECT 1");
        config.setAutoCommit(false);
        config.setPoolName("ConectaArcoverdePool");
        config.setRegisterMbeans(false);
        config.setAllowPoolSuspension(true);
        config.setLeakDetectionThreshold(60000);
        config.setKeepaliveTime(300000);

        HikariDataSource dataSource = new HikariDataSource(config);
        
        logger.info("✅ HikariCP DataSource inicializado com sucesso");
        logger.info("Pool size: {}", dataSource.getMaximumPoolSize());
        logger.info("========================================");

        return dataSource;
    }
}