package com.prefeitura.arcoverde.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "areas")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Area {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;
}