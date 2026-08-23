package com.prefeitura.arcoverde.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String fromEmail;

    public EmailService(
            @Autowired(required = false) JavaMailSender mailSender,
            @Value("${spring.mail.username:noreply@conecta.arcoverde}") String fromEmail) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;

        if (mailSender == null) {
            logger.warn("JavaMailSender NAO configurado. Envio de e-mails DESABILITADO.");
        } else {
            logger.info("JavaMailSender configurado. Envio de e-mails HABILITADO.");
        }
    }

    public void enviarEmail(String para, String assunto, String corpo) {
        if (mailSender == null) {
            logger.warn("Tentativa de enviar e-mail para {} ignorada (SMTP nao configurado)", para);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(para);
            message.setSubject(assunto);
            message.setText(corpo);
            mailSender.send(message);
            logger.info("E-mail enviado para: {}", para);
        } catch (Exception e) {
            logger.error("Erro ao enviar e-mail para {}: {}", para, e.getMessage());
        }
    }

    public void enviarEmailRecuperacaoSenha(String para, String token) {
        String assunto = "Recuperacao de Senha - Conecta Arcoverde";
        String corpo = String.format(
            "Ola!\n\nVoce solicitou recuperacao de senha.\n\nToken: %s\n\nEste token expira em 1 hora.\n\nEquipe Conecta Arcoverde",
            token
        );
        enviarEmail(para, assunto, corpo);
    }

    public void enviarEmailBoasVindas(String para, String nome) {
        String assunto = "Bem-vindo ao Conecta Arcoverde!";
        String corpo = String.format(
            "Ola, %s!\n\nBem-vindo ao Conecta Arcoverde.\n\nAcesse: https://conecta-arco.vercel.app\n\nEquipe Conecta Arcoverde",
            nome
        );
        enviarEmail(para, assunto, corpo);
    }
}