package com.prefeitura.arcoverde.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidaturas", uniqueConstraints = {
    @UniqueConstraint(name = "uk_candidatura", columnNames = {"vaga_id", "candidato_id"})
})
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Candidatura {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "vaga_id", nullable = false) private Vaga vaga;
    @ManyToOne @JoinColumn(name = "candidato_id", nullable = false) private Candidato candidato;
    @ManyToOne @JoinColumn(name = "curriculo_id", nullable = false) private Curriculo curriculo;
    @Enumerated(EnumType.STRING) @Builder.Default private EstadoCandidatura estado = EstadoCandidatura.INSCRITO;
    @Column(name = "data_candidatura", nullable = false) private LocalDateTime dataCandidatura;
    @Column(columnDefinition = "TEXT") private String resultado;
    @ManyToOne @JoinColumn(name = "encerrada_por") private Usuario encerradaPor;
    @Column(name = "encerrada_em") private LocalDateTime encerradaEm;

    public enum EstadoCandidatura { INSCRITO, EM_ANALISE, CONVOCADO_ENTREVISTA, SELECIONADO, NAO_SELECIONADO, DESISTIU }
}