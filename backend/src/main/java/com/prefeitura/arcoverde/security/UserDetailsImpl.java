package com.prefeitura.arcoverde.security;

import com.prefeitura.arcoverde.model.Usuario;
import com.prefeitura.arcoverde.model.enums.Perfil;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Getter
public class UserDetailsImpl implements UserDetails {
    private Long id;
    private String username;
    private String email;
    private String password;
    private Perfil perfil;
    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Long id, String username, String email, String password, Perfil perfil) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.perfil = perfil;
        this.authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + perfil.name()));
    }

    public static UserDetailsImpl build(Usuario usuario) {
        return new UserDetailsImpl(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getEmail(),
                usuario.getSenhaHash(),
                usuario.getPerfil()
        );
    }

    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}