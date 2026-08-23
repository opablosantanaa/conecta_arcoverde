package com.prefeitura.arcoverde.repository;

import com.prefeitura.arcoverde.model.AreaInteresse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AreaInteresseRepository extends JpaRepository<AreaInteresse, Long> {
    List<AreaInteresse> findByCandidatoId(Long candidatoId);
    void deleteByCandidatoId(Long candidatoId);
    boolean existsByCandidatoIdAndAreaId(Long candidatoId, Long areaId);
}