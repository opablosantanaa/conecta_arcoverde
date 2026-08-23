package com.prefeitura.arcoverde.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "empresas")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Empresa {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne @JoinColumn(name = "usuario_id", unique = true, nullable = false) private Usuario usuario;
    @Column(name = "nome_fantasia", nullable = false, length = 150) private String nomeFantasia;
    @Column(name = "razao_social", length = 200) private String razaoSocial;
    @Column(unique = true, length = 18) private String cnpj;
    @Column(name = "email_contato", length = 150) private String emailContato;
    @Column(length = 20) private String telefone;
    @Column(columnDefinition = "TEXT") private String endereco;
    @Column(name = "ocultar_nome_publicamente") @Builder.Default private Boolean ocultarNomePublicamente = false;
    @Column(nullable = false) @Builder.Default private Boolean ativo = true;
    @CreationTimestamp @Column(name = "criado_em", nullable = false, updatable = false) private LocalDateTime criadoEm;
}