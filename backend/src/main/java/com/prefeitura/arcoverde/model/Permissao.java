package com.prefeitura.arcoverde.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "permissoes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Permissao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 100)
    private String funcionalidade;

    @Column(nullable = false)
    @Builder.Default
    private Boolean permitido = false;
}