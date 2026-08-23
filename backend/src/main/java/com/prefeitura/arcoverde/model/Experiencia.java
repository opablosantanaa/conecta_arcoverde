package com.prefeitura.arcoverde.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "experiencias")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Experiencia {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "curriculo_id", nullable = false)
    private Curriculo curriculo;

    @Column(length = 150)
    private String empresa;

    @Column(length = 150)
    private String cargo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "data_inicio")
    private LocalDate dataInicio;

    @Column(name = "data_fim")
    private LocalDate dataFim;

    @Builder.Default
    private Boolean atual = false;
}