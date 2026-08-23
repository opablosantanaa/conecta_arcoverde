package com.prefeitura.arcoverde.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidatos")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Candidato {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne @JoinColumn(name = "usuario_id", unique = true, nullable = false) private Usuario usuario;
    @Column(name = "data_nascimento") private LocalDate dataNascimento;
    @Column(length = 20) private String genero;
    @Column(columnDefinition = "TEXT") private String endereco;
    @Column(length = 100) private String cidade;
    @Column(length = 2) private String estado;
    @Column(name = "cadastro_assistido") @Builder.Default private Boolean cadastroAssistido = false;
    @ManyToOne @JoinColumn(name = "assistido_por") private Usuario assistidoPor;
    @CreationTimestamp @Column(name = "criado_em", nullable = false, updatable = false) private LocalDateTime criadoEm;
}