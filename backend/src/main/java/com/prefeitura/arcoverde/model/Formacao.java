package com.prefeitura.arcoverde.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "formacoes")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Formacao {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "curriculo_id", nullable = false)
    private Curriculo curriculo;

    @Column(length = 200)
    private String instituicao;

    @Column(length = 200)
    private String curso;

    @Enumerated(EnumType.STRING)
    private NivelFormacao nivel;

    @Column(name = "data_inicio")
    private LocalDate dataInicio;

    @Column(name = "data_fim")
    private LocalDate dataFim;

    @Builder.Default
    private Boolean concluido = false;

    public enum NivelFormacao {
        FUNDAMENTAL, MEDIO, TECNICO, SUPERIOR, POS_GRADUACAO, MESTRADO, DOUTORADO
    }
}