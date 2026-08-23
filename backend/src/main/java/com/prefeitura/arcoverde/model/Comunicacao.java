package com.prefeitura.arcoverde.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "comunicacoes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comunicacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "candidatura_id", nullable = false)
    private Candidatura candidatura;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoComunicacao tipo;

    @Column(length = 200)
    private String assunto;

    @Column(columnDefinition = "TEXT")
    private String mensagem;

    @ManyToOne(optional = false)
    @JoinColumn(name = "enviado_por", nullable = false)
    private Usuario enviadoPor;

    @CreationTimestamp
    @Column(name = "enviado_em", nullable = false, updatable = false)
    private LocalDateTime enviadoEm;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatusComunicacao status = StatusComunicacao.ENVIADO;

    public enum TipoComunicacao {
        WHATSAPP, EMAIL
    }

    public enum StatusComunicacao {
        ENVIADO, ENTREGUE, LIDO, FALHOU
    }
}