package com.prefeitura.arcoverde.repository;

import com.prefeitura.arcoverde.model.Auditoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditoriaRepository extends JpaRepository<Auditoria, Long> {
    Page<Auditoria> findByUsuarioId(Long usuarioId, Pageable pageable);
}