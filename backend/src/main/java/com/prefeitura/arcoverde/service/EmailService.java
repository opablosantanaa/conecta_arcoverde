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
            logger.warn("JavaMailSender não configurado. Envio de e-mails está DESABILITADO.");
            logger.warn("Para habilitar, configure as variáveis: spring.mail.host, spring.mail.port, spring.mail.username, spring.mail.password");
        } else {
            logger.info("JavaMailSender configurado com sucesso. Envio de e-mails HABILITADO.");
        }
    }

    public void enviarEmail(String para, String assunto, String corpo) {
        if (mailSender == null) {
            logger.warn("Tentativa de enviar e-mail para {} com assunto '{}', mas JavaMailSender não está configurado. E-mail NÃO enviado.", para, assunto);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(para);
            message.setSubject(assunto);
            message.setText(corpo);
            
            mailSender.send(message);
            logger.info("E-mail enviado com sucesso para: {}", para);
        } catch (Exception e) {
            logger.error("Erro ao enviar e-mail para {}: {}", para, e.getMessage(), e);
        }
    }

    public void enviarEmailRecuperacaoSenha(String para, String token) {
        String assunto = "Recuperação de Senha - Conecta Arcoverde";
        String corpo = String.format(
            "Olá!\n\n" +
            "Você solicitou a recuperação de senha na plataforma Conecta Arcoverde.\n\n" +
            "Use o seguinte token para redefinir sua senha:\n\n" +
            "%s\n\n" +
            "Este token expira em 1 hora.\n\n" +
            "Se você não solicitou esta recuperação, ignore este e-mail.\n\n" +
            "Atenciosamente,\n" +
            "Equipe Conecta Arcoverde\n" +
            "Prefeitura Municipal de Arcoverde-PE",
            token
        );
        
        enviarEmail(para, assunto, corpo);
    }

    public void enviarEmailBoasVindas(String para, String nome) {
        String assunto = "Bem-vindo ao Conecta Arcoverde!";
        String corpo = String.format(
            "Olá, %s!\n\n" +
            "Seja bem-vindo à plataforma Conecta Arcoverde.\n\n" +
            "Agora você pode:\n" +
            "- Criar e validar seu currículo\n" +
            "- Candidatar-se a vagas\n" +
            "- Inscrever-se em cursos de capacitação\n\n" +
            "Acesse: https://conecta-arco.vercel.app\n\n" +
            "Atenciosamente,\n" +
            "Equipe Conecta Arcoverde\n" +
            "Prefeitura Municipal de Arcoverde-PE",
            nome
        );
        
        enviarEmail(para, assunto, corpo);
    }

    public boolean isMailConfigurado() {
        return mailSender != null;
    }
}