package com.prefeitura.arcoverde.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vagas")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Vaga {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, length = 150) private String titulo;
    @Column(columnDefinition = "TEXT") private String descricao;
    @ManyToOne @JoinColumn(name = "empresa_id", nullable = false) private Empresa empresa;
    @ManyToOne @JoinColumn(name = "area_id", nullable = false) private Area area;
    @Column(columnDefinition = "TEXT") private String requisitos;
    @Column(columnDefinition = "TEXT") private String beneficios;
    @Column(name = "salario_minimo", precision = 10, scale = 2) private BigDecimal salarioMinimo;
    @Column(name = "salario_maximo", precision = 10, scale = 2) private BigDecimal salarioMaximo;
    @Enumerated(EnumType.STRING) @Column(name = "tipo_contrato") private TipoContrato tipoContrato;
    @Column(name = "quantidade_vagas") @Builder.Default private Integer quantidadeVagas = 1;
    @Column(length = 100) @Builder.Default private String cidade = "Arcoverde";
    @Column(length = 2) @Builder.Default private String estado = "PE";
    @Enumerated(EnumType.STRING) @Column(name = "estado_vaga") @Builder.Default private EstadoVaga estadoVaga = EstadoVaga.RASCUNHO;
    @ManyToOne @JoinColumn(name = "aprovada_por") private Usuario aprovadaPor;
    @Column(name = "aprovada_em") private LocalDateTime aprovadaEm;
    @ManyToOne @JoinColumn(name = "cadastrada_por", nullable = false) private Usuario cadastradaPor;
    @CreationTimestamp @Column(name = "criado_em", nullable = false, updatable = false) private LocalDateTime criadoEm;
    @UpdateTimestamp @Column(name = "atualizado_em") private LocalDateTime atualizadoEm;

    public enum TipoContrato { CLT, TEMPORARIO, ESTAGIO, AUTONOMO, OUTROS }
    public enum EstadoVaga { RASCUNHO, AGUARDANDO_APROVACAO, APROVADA, PUBLICADA, ENCERRADA, CANCELADA }
}