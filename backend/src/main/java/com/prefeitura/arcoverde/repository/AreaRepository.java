package com.prefeitura.arcoverde.repository;

import com.prefeitura.arcoverde.model.Area;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AreaRepository extends JpaRepository<Area, Long> {
    Optional<Area> findByNome(String nome);
    boolean existsByNome(String nome);
}