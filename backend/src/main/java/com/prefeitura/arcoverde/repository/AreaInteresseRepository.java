package com.prefeitura.arcoverde.repository;

import com.prefeitura.arcoverde.model.AreaInteresse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AreaInteresseRepository extends JpaRepository<AreaInteresse, Long> {
    List<AreaInteresse> findByCandidatoId(Long candidatoId);
    void deleteByCandidatoId(Long candidatoId);
    boolean existsByCandidatoIdAndAreaId(Long candidatoId, Long areaId);

    @Query("SELECT ai.area.nome AS nome, COUNT(ai) AS quantidade " +
           "FROM AreaInteresse ai " +
           "GROUP BY ai.area.nome " +
           "ORDER BY COUNT(ai) DESC")
    List<Object[]> countAreasPorInteresse();
}