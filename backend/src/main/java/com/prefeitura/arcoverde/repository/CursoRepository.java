package com.prefeitura.arcoverde.repository;

import com.prefeitura.arcoverde.model.Curso;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface CursoRepository extends JpaRepository<Curso, Long> {
    Page<Curso> findByEstado(Curso.EstadoCurso estado, Pageable pageable);

    @Query("""
        SELECT c FROM Curso c
        WHERE c.estado = :estado
          AND (:titulo IS NULL OR LOWER(c.titulo) LIKE LOWER(CONCAT('%', :titulo, '%')))
          AND (:areaId IS NULL OR c.area.id = :areaId)
          AND (:dataRef IS NULL OR (c.dataInicio IS NULL OR c.dataInicio <= :dataRef)
                                   AND (c.dataFim IS NULL OR c.dataFim >= :dataRef))
    """)
    Page<Curso> buscarPublico(
            @Param("estado") Curso.EstadoCurso estado,
            @Param("titulo") String titulo,
            @Param("areaId") Long areaId,
            @Param("dataRef") LocalDate dataRef,
            Pageable pageable);

    long countByEstado(Curso.EstadoCurso estado);
}