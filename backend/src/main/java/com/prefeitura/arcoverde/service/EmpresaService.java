package com.prefeitura.arcoverde.service;

import com.prefeitura.arcoverde.dto.response.EmpresaResponse;
import com.prefeitura.arcoverde.exception.ResourceNotFoundException;
import com.prefeitura.arcoverde.model.Empresa;
import com.prefeitura.arcoverde.repository.EmpresaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmpresaService {

    private final EmpresaRepository empresaRepository;

    public EmpresaService(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
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
}