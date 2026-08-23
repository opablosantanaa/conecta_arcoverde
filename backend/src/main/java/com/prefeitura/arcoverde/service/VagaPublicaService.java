package com.prefeitura.arcoverde.service;

import com.prefeitura.arcoverde.dto.request.VagaFiltroRequest;
import com.prefeitura.arcoverde.dto.response.VagaPublicaResponse;
import com.prefeitura.arcoverde.exception.ResourceNotFoundException;
import com.prefeitura.arcoverde.model.Vaga;
import com.prefeitura.arcoverde.repository.VagaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VagaPublicaService {

    private final VagaRepository vagaRepository;

    public VagaPublicaService(VagaRepository vagaRepository) {
        this.vagaRepository = vagaRepository;
    }

    @Transactional(readOnly = true)
    public Page<VagaPublicaResponse> buscar(VagaFiltroRequest filtro, Pageable pageable) {
        return vagaRepository.buscarPublica(
                Vaga.EstadoVaga.PUBLICADA,
                filtro.titulo(),
                filtro.areaId(),
                filtro.cidade(),
                filtro.tipoContrato(),
                pageable
        ).map(VagaPublicaResponse::from);
    }

    @Transactional(readOnly = true)
    public VagaPublicaResponse buscarPorId(Long id) {
        Vaga vaga = vagaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada"));

        if (vaga.getEstadoVaga() != Vaga.EstadoVaga.PUBLICADA) {
            throw new ResourceNotFoundException("Vaga não encontrada");
        }
        return VagaPublicaResponse.from(vaga);
    }
}