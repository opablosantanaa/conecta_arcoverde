package com.prefeitura.arcoverde.service;

import com.prefeitura.arcoverde.dto.request.CadastroAssistidoRequest;
import com.prefeitura.arcoverde.dto.request.CurriculoRequest;
import com.prefeitura.arcoverde.dto.response.CadastroAssistidoResponse;
import com.prefeitura.arcoverde.exception.BusinessException;
import com.prefeitura.arcoverde.model.Candidato;
import com.prefeitura.arcoverde.model.Curriculo;
import com.prefeitura.arcoverde.model.Usuario;
import com.prefeitura.arcoverde.model.enums.Perfil;
import com.prefeitura.arcoverde.repository.CandidatoRepository;
import com.prefeitura.arcoverde.repository.CurriculoRepository;
import com.prefeitura.arcoverde.repository.UsuarioRepository;
import com.prefeitura.arcoverde.security.UserDetailsImpl;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class CadastroAssistidoService {

    private final UsuarioRepository usuarioRepository;
    private final CandidatoRepository candidatoRepository;
    private final CurriculoRepository curriculoRepository;
    private final CurriculoService curriculoService;
    private final PasswordEncoder passwordEncoder;
    private final AuditoriaService auditoriaService;

    public CadastroAssistidoService(UsuarioRepository usuarioRepository,
                                    CandidatoRepository candidatoRepository,
                                    CurriculoRepository curriculoRepository,
                                    CurriculoService curriculoService,
                                    PasswordEncoder passwordEncoder,
                                    AuditoriaService auditoriaService) {
        this.usuarioRepository = usuarioRepository;
        this.candidatoRepository = candidatoRepository;
        this.curriculoRepository = curriculoRepository;
        this.curriculoService = curriculoService;
        this.passwordEncoder = passwordEncoder;
        this.auditoriaService = auditoriaService;
    }

    /**
     * RN009-RN012: Cadastro Assistido
     * ACA/Prefeitura cadastra candidato em nome dele.
     * Uma senha temporária aleatória é gerada e enviada por e-mail (futuro).
     * Após o cadastro, ACA/Prefeitura NÃO podem mais editar o currículo.
     * O candidato poderá editar seu próprio currículo ao acessar com suas credenciais.
     */
    @Transactional
    public CadastroAssistidoResponse cadastrar(CadastroAssistidoRequest request, HttpServletRequest httpRequest) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new BusinessException("Já existe um usuário com este e-mail");
        }
        if (request.cpf() != null && !request.cpf().isBlank()
                && usuarioRepository.existsByCpf(request.cpf())) {
            throw new BusinessException("Já existe um usuário com este CPF");
        }

        Usuario assistidoPor = usuarioAtual();

        // Senha temporária (o candidato deverá trocar no primeiro acesso)
        String senhaTemporaria = UUID.randomUUID().toString().substring(0, 10) + "@Aa1";

        Usuario usuario = Usuario.builder()
                .nome(request.nome())
                .email(request.email())
                .senhaHash(passwordEncoder.encode(senhaTemporaria))
                .cpf(request.cpf())
                .telefone(request.telefone())
                .perfil(Perfil.CANDIDATO)
                .ativo(true)
                .build();
        usuario = usuarioRepository.save(usuario);

        Candidato candidato = Candidato.builder()
                .usuario(usuario)
                .dataNascimento(request.dataNascimento())
                .genero(request.genero())
                .endereco(request.endereco())
                .cidade(request.cidade())
                .estado(request.estado())
                .cadastroAssistido(true)
                .assistidoPor(assistidoPor)
                .build();
        candidato = candidatoRepository.save(candidato);

        // Criar currículo com os dados fornecidos (estado VALIDADO pois foi assistido)
        Curriculo curriculo = Curriculo.builder()
                .candidato(candidato)
                .estado(Curriculo.EstadoCurriculo.VALIDADO)
                .validadoPor(assistidoPor)
                .validadoEm(java.time.LocalDateTime.now())
                .build();
        curriculo = curriculoRepository.save(curriculo);

        // Aplicar os dados do currículo usando a lógica existente (reaproveitamento)
        // Como o CurriculoService exige autenticação como CANDIDATO, salvamos inline
        curriculo.setObjetivo(request.curriculo().objetivo());
        curriculo.setResumoProfissional(request.curriculo().resumoProfissional());
        curriculo = curriculoRepository.save(curriculo);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("candidatoId", candidato.getId());
        detalhes.put("email", usuario.getEmail());
        detalhes.put("assistidoPorId", assistidoPor.getId());
        auditoriaService.registrar("CADASTRO_ASSISTIDO", "CANDIDATO",
                candidato.getId(), detalhes, httpRequest);

        return CadastroAssistidoResponse.from(candidato, curriculo.getId());
    }

    private Usuario usuarioAtual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl u) {
            return usuarioRepository.getReferenceById(u.getId());
        }
        throw new BusinessException("Usuário não autenticado");
    }
}