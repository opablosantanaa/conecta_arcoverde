package com.prefeitura.arcoverde.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cursos")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Curso {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, length = 200) private String titulo;
    @Column(columnDefinition = "TEXT") private String descricao;
    @Column(length = 150) private String instituicao;
    @ManyToOne @JoinColumn(name = "area_id") private Area area;
    @Column(name = "link_inscricao", length = 500) private String linkInscricao;
    @Column(name = "link_plataforma", length = 500) private String linkPlataforma;
    @Column(name = "carga_horaria") private Integer cargaHoraria;
    @Column(name = "data_inicio") private LocalDate dataInicio;
    @Column(name = "data_fim") private LocalDate dataFim;
    @Enumerated(EnumType.STRING) @Builder.Default private EstadoCurso estado = EstadoCurso.ATIVO;
    @ManyToOne @JoinColumn(name = "cadastrado_por", nullable = false) private Usuario cadastradoPor;
    @CreationTimestamp @Column(name = "criado_em", nullable = false, updatable = false) private LocalDateTime criadoEm;
    @UpdateTimestamp @Column(name = "atualizado_em") private LocalDateTime atualizadoEm;

    public enum EstadoCurso { ATIVO, INATIVO, EXPIRADO }
}