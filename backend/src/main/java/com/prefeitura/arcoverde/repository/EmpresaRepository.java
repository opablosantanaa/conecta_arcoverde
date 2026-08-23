package com.prefeitura.arcoverde.repository;

import com.prefeitura.arcoverde.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    Optional<Empresa> findByUsuarioId(Long usuarioId);
    Optional<Empresa> findByCnpj(String cnpj);
    boolean existsByCnpj(String cnpj);
}