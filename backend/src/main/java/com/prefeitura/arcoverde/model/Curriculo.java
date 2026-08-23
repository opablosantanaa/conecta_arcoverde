package com.prefeitura.arcoverde.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "curriculos")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Curriculo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne @JoinColumn(name = "candidato_id", unique = true, nullable = false) private Candidato candidato;
    @Column(columnDefinition = "TEXT") private String objetivo;
    @Column(name = "resumo_profissional", columnDefinition = "TEXT") private String resumoProfissional;
    @Enumerated(EnumType.STRING) @Builder.Default private EstadoCurriculo estado = EstadoCurriculo.RASCUNHO;
    @ManyToOne @JoinColumn(name = "validado_por") private Usuario validadoPor;
    @Column(name = "validado_em") private LocalDateTime validadoEm;
    @Column(name = "motivo_rejeicao", columnDefinition = "TEXT") private String motivoRejeicao;
    @Column(name = "pdf_url", length = 500) private String pdfUrl;
    @CreationTimestamp @Column(name = "criado_em", nullable = false, updatable = false) private LocalDateTime criadoEm;
    @UpdateTimestamp @Column(name = "atualizado_em") private LocalDateTime atualizadoEm;

    public enum EstadoCurriculo { RASCUNHO, PENDENTE_VALIDACAO, VALIDADO, REJEITADO }
}