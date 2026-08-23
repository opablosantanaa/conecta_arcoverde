package com.prefeitura.arcoverde.service;

import com.prefeitura.arcoverde.model.Area;
import com.prefeitura.arcoverde.model.Empresa;
import com.prefeitura.arcoverde.model.Usuario;
import com.prefeitura.arcoverde.model.Vaga;
import com.prefeitura.arcoverde.repository.AreaRepository;
import com.prefeitura.arcoverde.repository.EmpresaRepository;
import com.prefeitura.arcoverde.repository.UsuarioRepository;
import com.prefeitura.arcoverde.repository.VagaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class VagaServiceTest {

    private VagaService vagaService;

    @BeforeEach
    void setUp() {
        vagaService = new VagaService(
                org.mockito.Mockito.mock(VagaRepository.class),
                org.mockito.Mockito.mock(EmpresaRepository.class),
                org.mockito.Mockito.mock(AreaRepository.class),
                org.mockito.Mockito.mock(UsuarioRepository.class),
                org.mockito.Mockito.mock(AuditoriaService.class)
        );
    }

    @Test
    void devePermitirEdicaoDentroDe12Horas() {
        Vaga vaga = Vaga.builder().build();
        vaga.setCriadoEm(LocalDateTime.now().minusHours(6));
        assertTrue(vagaService.podeEditarDiretamente(vaga));
    }

    @Test
    void deveBloquearEdicaoApos12Horas() {
        Vaga vaga = Vaga.builder().build();
        vaga.setCriadoEm(LocalDateTime.now().minusHours(13));
        assertFalse(vagaService.podeEditarDiretamente(vaga));
    }

    @Test
    void deveBloquearEdicaoNoLimiteExato() {
        Vaga vaga = Vaga.builder().build();
        vaga.setCriadoEm(LocalDateTime.now().minusHours(12));
        assertFalse(vagaService.podeEditarDiretamente(vaga));
    }

    @Test
    void devePermitirEdicaoNoMinuto59DaHora11() {
        Vaga vaga = Vaga.builder().build();
        vaga.setCriadoEm(LocalDateTime.now().minusHours(11).minusMinutes(59));
        assertTrue(vagaService.podeEditarDiretamente(vaga));
    }
}