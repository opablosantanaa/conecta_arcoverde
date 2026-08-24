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
        // Validação de email obrigatório
        if (request.emailContato() == null || request.emailContato().isBlank()) {
            throw new BusinessException("Email da empresa é obrigatório");
        }

        // Verificar se email já está em uso
        if (usuarioRepository.existsByEmail(request.emailContato())) {
            throw new BusinessException("Email já está em uso por outro usuário");
        }

        // Gerar senha automática baseada no nome da empresa
        String senhaAutomatica = gerarSenhaEmpresa(request.nomeFantasia());

        // Criar usuário da empresa com email real e senha automática
        Usuario usuario = Usuario.builder()
                .nome(request.nomeFantasia())
                .email(request.emailContato())
                .senhaHash(passwordEncoder.encode(senhaAutomatica))
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
        
        // TODO: Enviar email com a senha automática para o usuário
        // emailService.enviarSenhaTemporaria(request.emailContato(), senhaAutomatica);
        
        return EmpresaResponse.from(empresa);
    }

    /**
     * Gera senha automática para novo usuário da empresa.
     * Padrão: primeiroNomeEmpresa@123 ou primeiroNomeEmpresa@1234 (mínimo 8 caracteres)
     */
    private String gerarSenhaEmpresa(String nomeEmpresa) {
        if (nomeEmpresa == null || nomeEmpresa.isBlank()) {
            return "Empresa@1234";
        }
        
        // Pega o primeiro nome da empresa (antes do primeiro espaço)
        String primeiroNome = nomeEmpresa.split(" ")[0].trim();
        
        // Remove caracteres especiais e mantém apenas letras/números
        primeiroNome = primeiroNome.replaceAll("[^a-zA-Z0-9]", "");
        
        if (primeiroNome.isEmpty()) {
            primeiroNome = "Empresa";
        }
        
        // Tenta com @123 primeiro
        String senhaBase = primeiroNome + "@123";
        
        // Se não atingir 8 caracteres, adiciona mais um dígito
        if (senhaBase.length() < 8) {
            senhaBase = primeiroNome + "@1234";
        }
        
        // Se ainda não atingir 8, adiciona @12345
        if (senhaBase.length() < 8) {
            senhaBase = primeiroNome + "@12345";
        }
        
        return senhaBase;
    }
}