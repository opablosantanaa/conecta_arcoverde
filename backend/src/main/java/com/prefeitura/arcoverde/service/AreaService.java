package com.prefeitura.arcoverde.service;

import com.prefeitura.arcoverde.dto.request.AreaRequest;
import com.prefeitura.arcoverde.dto.response.AreaResponse;
import com.prefeitura.arcoverde.exception.BusinessException;
import com.prefeitura.arcoverde.exception.ResourceNotFoundException;
import com.prefeitura.arcoverde.model.Area;
import com.prefeitura.arcoverde.repository.AreaRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AreaService {

    private final AreaRepository areaRepository;
    private final AuditoriaService auditoriaService;

    public AreaService(AreaRepository areaRepository, AuditoriaService auditoriaService) {
        this.areaRepository = areaRepository;
        this.auditoriaService = auditoriaService;
    }

    @Transactional(readOnly = true)
    public List<AreaResponse> listarTodas() {
        return areaRepository.findAll().stream().map(AreaResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public Page<AreaResponse> listarPaginado(Pageable pageable) {
        return areaRepository.findAll(pageable).map(AreaResponse::from);
    }

    @Transactional(readOnly = true)
    public AreaResponse buscarPorId(Long id) {
        return AreaResponse.from(areaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Área não encontrada")));
    }

    @Transactional
    public AreaResponse criar(AreaRequest request, HttpServletRequest httpRequest) {
        if (areaRepository.existsByNome(request.nome())) {
            throw new BusinessException("Já existe uma área com este nome");
        }
        Area area = Area.builder()
                .nome(request.nome())
                .descricao(request.descricao())
                .build();
        area = areaRepository.save(area);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("nome", area.getNome());
        auditoriaService.registrar("CRIAR_AREA", "AREA", area.getId(), detalhes, httpRequest);

        return AreaResponse.from(area);
    }

    @Transactional
    public AreaResponse atualizar(Long id, AreaRequest request, HttpServletRequest httpRequest) {
        Area area = areaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Área não encontrada"));

        areaRepository.findByNome(request.nome())
                .ifPresent(existente -> {
                    if (!existente.getId().equals(id)) {
                        throw new BusinessException("Já existe uma área com este nome");
                    }
                });

        area.setNome(request.nome());
        area.setDescricao(request.descricao());
        area = areaRepository.save(area);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("nome", area.getNome());
        auditoriaService.registrar("ATUALIZAR_AREA", "AREA", area.getId(), detalhes, httpRequest);

        return AreaResponse.from(area);
    }

    @Transactional
    public void remover(Long id, HttpServletRequest httpRequest) {
        Area area = areaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Área não encontrada"));
        areaRepository.delete(area);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("nome", area.getNome());
        auditoriaService.registrar("REMOVER_AREA", "AREA", area.getId(), detalhes, httpRequest);
    }
}