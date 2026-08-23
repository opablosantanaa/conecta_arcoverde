package com.prefeitura.arcoverde.service;

import com.prefeitura.arcoverde.exception.BusinessException;
import com.prefeitura.arcoverde.model.Area;
import com.prefeitura.arcoverde.model.Empresa;
import com.prefeitura.arcoverde.model.Vaga;
import com.prefeitura.arcoverde.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PortalEmpresaServiceTest {

    @Mock private EmpresaRepository empresaRepository;
    @Mock private VagaRepository vagaRepository;
    @Mock private CandidaturaRepository candidaturaRepository;
    @Mock private ExperienciaRepository experienciaRepository;
    @Mock private FormacaoRepository formacaoRepository;
    @Mock private CursoLivreRepository cursoLivreRepository;
    @Mock private AreaInteresseRepository areaInteresseRepository;
    @Mock private VagaService vagaService;
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private AuditoriaService auditoriaService;

    @InjectMocks
    private PortalEmpresaService service;

    @Test
    void deveBloquearAcessoAVagaDeOutraEmpresa() {
        // Empresa A autenticada
        Empresa empresaA = Empresa.builder().id(1L).build();
        // Vaga pertence à empresa B (id=2)
        Empresa empresaB = Empresa.builder().id(2L).build();
        Area area = Area.builder().id(1L).nome("TI").build();
        Vaga vaga = Vaga.builder().id(10L).empresa(empresaB).area(area).build();

        // Stub para fazer empresaDoUsuarioAtual() retornar empresaA
        when(empresaRepository.findByUsuarioId(Mockito.anyLong()))
                .thenReturn(Optional.of(empresaA));
        when(vagaRepository.findById(10L)).thenReturn(Optional.of(vaga));

        BusinessException ex = assertThrows(BusinessException.class,
                () -> service.buscarMinhaVaga(10L));
        assertTrue(ex.getMessage().contains("não tem acesso"));
    }
}