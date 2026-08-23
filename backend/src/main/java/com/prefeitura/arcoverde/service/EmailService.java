package com.prefeitura.arcoverde.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:email@teste.com}")
    private String remetente;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void enviarHtml(String destinatario, String assunto, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(remetente);
            helper.setTo(destinatario);
            helper.setSubject(assunto);
            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception ex) {
            // Log silencioso - não podemos vazar falhas de e-mail
            System.err.println("Falha ao enviar e-mail para " + destinatario + ": " + ex.getMessage());
        }
    }

    public void enviarRecuperacaoSenha(String destinatario, String token) {
        String link = "http://localhost:3000/recuperar-senha?token=" + token;
        String html = """
                <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
                  <h2 style="color:#2D5A3D">Recuperação de Acesso</h2>
                  <p>Você solicitou a redefinição de senha no <strong>Conecta Arcoverde</strong>.</p>
                  <p>Use o link abaixo para criar uma nova senha (válido por 1 hora):</p>
                  <a href="%s" style="display:inline-block;padding:10px 20px;background:#2D5A3D;color:white;text-decoration:none;border-radius:6px;">Redefinir Senha</a>
                  <p style="color:#666;font-size:12px;margin-top:20px;">Se você não solicitou, ignore este e-mail.</p>
                </div>
                """.formatted(link);
        enviarHtml(destinatario, "Recuperação de senha - Conecta Arcoverde", html);
    }
}