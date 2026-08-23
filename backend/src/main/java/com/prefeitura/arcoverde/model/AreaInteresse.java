package com.prefeitura.arcoverde.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "areas_interesse", uniqueConstraints = {
        @UniqueConstraint(name = "uk_area_interesse", columnNames = {"candidato_id", "area_id"})
})
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AreaInteresse {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "candidato_id", nullable = false)
    private Candidato candidato;

    @ManyToOne(optional = false)
    @JoinColumn(name = "area_id", nullable = false)
    private Area area;
}