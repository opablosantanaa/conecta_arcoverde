package com.prefeitura.arcoverde.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "solicitacoes_alteracao")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SolicitacaoAlteracao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "vaga_id", nullable = false)
    private Vaga vaga;

    @ManyToOne(optional = false)
    @JoinColumn(name = "solicitante_id", nullable = false)
    private Usuario solicitante;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EstadoSolicitacao estado = EstadoSolicitacao.PENDENTE;

    @ManyToOne
    @JoinColumn(name = "resolvido_por")
    private Usuario resolvidoPor;

    @Column(name = "resolvido_em")
    private LocalDateTime resolvidoEm;

    @Column(name = "resposta", columnDefinition = "TEXT")
    private String resposta;

    @CreationTimestamp
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @UpdateTimestamp
    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    public enum EstadoSolicitacao {
        PENDENTE, APROVADA, REJEITADA, CANCELADA
    }
}