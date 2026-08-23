package com.prefeitura.arcoverde.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "auditoria")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Auditoria {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 100)
    private String acao;

    @Column(nullable = false, length = 50)
    private String entidade;

    @Column(name = "entidade_id")
    private Long entidadeId;

    @Column(columnDefinition = "JSON")
    private String detalhes;

    @Column(name = "ip_origem", length = 45)
    private String ipOrigem;

    @CreationTimestamp
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;
}