package com.prefeitura.arcoverde.repository;

import com.prefeitura.arcoverde.model.Usuario;
import com.prefeitura.arcoverde.model.enums.Perfil;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByCpf(String cpf);
    Boolean existsByEmail(String email);
    Boolean existsByCpf(String cpf);
    long countByPerfilAndAtivoTrue(Perfil perfil);
}