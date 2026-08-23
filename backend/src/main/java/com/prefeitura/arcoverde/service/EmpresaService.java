package com.prefeitura.arcoverde.service;

import com.prefeitura.arcoverde.dto.request.EmpresaRequest;
import com.prefeitura.arcoverde.dto.response.EmpresaResponse;
import com.prefeitura.arcoverde.exception.BusinessException;
import com.prefeitura.arcoverde.exception.ResourceNotFoundException;
import com.prefeitura.arcoverde.model.Empresa;
import com.prefeitura.arcoverde.model.Usuario;
import com.prefeitura.arcoverde.model.enums.Perfil;
import com.prefeitura.arcoverde.repository.EmpresaRepository;
import com.prefeitura.arcoverde.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public EmpresaService(EmpresaRepository empresaRepository,
                         UsuarioRepository usuarioRepository,
                         PasswordEncoder passwordEncoder) {
        this.empresaRepository = empresaRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<EmpresaResponse> listarTodas() {
        return empresaRepository.findAll().stream().map(EmpresaResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public Page<EmpresaResponse> listarPaginado(Pageable pageable) {
        return empresaRepository.findAll(pageable).map(EmpresaResponse::from);
    }

    @Transactional(readOnly = true)
    public EmpresaResponse buscarPorId(Long id) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa não encontrada"));
        return EmpresaResponse.from(empresa);
    }

    @Transactional(readOnly = true)
    public Empresa buscarEntidadePorId(Long id) {
        return empresaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa não encontrada"));
    }

    @Transactional
    public EmpresaResponse criar(EmpresaRequest request) {
        // Gerar e-mail e senha temporários para a empresa
        String emailTemp = "empresa_" + System.currentTimeMillis() + "@temporario.local";
        String senhaTemp = "Temp@12345";

        if (usuarioRepository.existsByEmail(emailTemp)) {
            emailTemp = "empresa_" + (System.currentTimeMillis() + 1) + "@temporario.local";
        }

        Usuario usuario = Usuario.builder()
                .nome(request.nomeFantasia())
                .email(emailTemp)
                .senhaHash(passwordEncoder.encode(senhaTemp))
                .cpf("000.000.000-" + String.format("%02d", (int)(Math.random() * 100)))
                .telefone(request.telefone())
                .perfil(Perfil.EMPRESA)
                .ativo(true)
                .build();

        usuario = usuarioRepository.save(usuario);

        Empresa empresa = Empresa.builder()
                .usuario(usuario)
                .nomeFantasia(request.nomeFantasia())
                .razaoSocial(request.razaoSocial())
                .cnpj(request.cnpj())
                .emailContato(request.emailContato())
                .telefone(request.telefone())
                .endereco(request.endereco())
                .ocultarNomePublicamente(request.ocultarNomePublicamente() != null ? request.ocultarNomePublicamente() : false)
                .ativo(true)
                .build();

        empresa = empresaRepository.save(empresa);
        return EmpresaResponse.from(empresa);
    }
}