package com.prefeitura.arcoverde.repository;

import com.prefeitura.arcoverde.model.Permissao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PermissaoRepository extends JpaRepository<Permissao, Long> {
    List<Permissao> findByUsuarioId(Long usuarioId);
    Optional<Permissao> findByUsuarioIdAndFuncionalidade(Long usuarioId, String funcionalidade);
    void deleteByUsuarioIdAndFuncionalidade(Long usuarioId, String funcionalidade);
}