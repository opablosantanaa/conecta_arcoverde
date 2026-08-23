package com.prefeitura.arcoverde.repository;

import com.prefeitura.arcoverde.model.Vaga;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VagaRepository extends JpaRepository<Vaga, Long> {

    Page<Vaga> findByEstadoVaga(Vaga.EstadoVaga estado, Pageable pageable);

    @Query("""
        SELECT v FROM Vaga v
        WHERE v.estadoVaga = :estado
          AND (:titulo IS NULL OR LOWER(v.titulo) LIKE LOWER(CONCAT('%', :titulo, '%')))
          AND (:areaId IS NULL OR v.area.id = :areaId)
          AND (:cidade IS NULL OR LOWER(v.cidade) LIKE LOWER(CONCAT('%', :cidade, '%')))
          AND (:tipoContrato IS NULL OR v.tipoContrato = :tipoContrato)
    """)
    Page<Vaga> buscarPublica(
            @Param("estado") Vaga.EstadoVaga estado,
            @Param("titulo") String titulo,
            @Param("areaId") Long areaId,
            @Param("cidade") String cidade,
            @Param("tipoContrato") Vaga.TipoContrato tipoContrato,
            Pageable pageable);

    List<Vaga> findByEmpresaId(Long empresaId);

    long countByEstadoVaga(Vaga.EstadoVaga estado);
}