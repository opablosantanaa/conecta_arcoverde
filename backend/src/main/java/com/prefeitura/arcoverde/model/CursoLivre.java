package com.prefeitura.arcoverde.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cursos_livres")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CursoLivre {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "curriculo_id", nullable = false)
    private Curriculo curriculo;

    @Column(length = 200)
    private String nome;

    @Column(length = 200)
    private String instituicao;

    @Column(name = "carga_horaria")
    private Integer cargaHoraria;

    @Column(name = "ano_conclusao")
    private Integer anoConclusao;
}