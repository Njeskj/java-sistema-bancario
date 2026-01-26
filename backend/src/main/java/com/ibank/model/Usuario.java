package com.ibank.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 100)
    private String sobrenome;

    @Column(nullable = false, unique = true)
    private String cpf;

    @Column(name = "cpf_hash", nullable = false, unique = true, length = 64)
    private String cpfHash;

    private String rg;

    private String telefone;

    @Column(name = "telefone_pais", length = 5)
    private String telefonePais = "+55";

    @Column(unique = true)
    private String email;

    @Column(name = "email_hash", nullable = false, unique = true, length = 64)
    private String emailHash;

    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;

    @Column(nullable = false)
    private String salt;

    @Column(name = "nome_mae")
    private String nomeMae;

    @Column(name = "nome_pai")
    private String nomePai;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(length = 30)
    private String sexo;

    @Column(length = 2)
    private String nacionalidade = "BR";

    @Column(length = 100)
    private String naturalidade;

    @Column(name = "estado_civil", length = 20)
    private String estadoCivil;

    @Column(length = 100)
    private String profissao;

    @Column(name = "renda_mensal", precision = 15, scale = 2)
    private java.math.BigDecimal rendaMensal;

    @Column(length = 150)
    private String empresa;

    @Column(length = 100)
    private String cargo;

    @Column(name = "endereco_logradouro")
    private String enderecoLogradouro;

    @Column(name = "endereco_numero", length = 20)
    private String enderecoNumero;

    @Column(name = "endereco_complemento", length = 100)
    private String enderecoComplemento;

    @Column(name = "endereco_bairro", length = 100)
    private String enderecoBairro;

    @Column(name = "endereco_cidade", length = 100)
    private String enderecoCidade;

    @Column(name = "endereco_estado", length = 2)
    private String enderecoEstado;

    @Column(name = "endereco_cep", length = 10)
    private String enderecoCep;

    @Column(name = "endereco_pais", length = 2)
    private String enderecoPais = "BR";

    @Column(name = "dois_fatores_ativo")
    private boolean doisFatoresAtivo = false;

    @Column(name = "dois_fatores_secret")
    private String doisFatoresSecret;

    @Column(name = "tentativas_login_falhas")
    private Integer tentativasLoginFalhas = 0;

    @Column(name = "conta_bloqueada")
    private boolean contaBloqueada = false;

    @Column(name = "data_ultimo_login")
    private LocalDateTime dataUltimoLogin;

    @Column(name = "ip_ultimo_login", length = 45)
    private String ipUltimoLogin;

    @Column(length = 5)
    private String idioma = "pt-BR";

    @Column(name = "moeda_preferencial", length = 3)
    private String moedaPreferencial = "BRL";

    @Column(nullable = false)
    private boolean ativo = true;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    @Column(name = "ultima_atualizacao")
    private LocalDateTime ultimaAtualizacao;

    @Column(name = "criado_por", length = 100)
    private String criadoPor;

    @Column(name = "atualizado_por", length = 100)
    private String atualizadoPor;

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        ultimaAtualizacao = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        ultimaAtualizacao = LocalDateTime.now();
    }

    /**
     * Verifica se é usuário brasileiro
     */
    public boolean isBrasileiro() {
        return "BR".equals(nacionalidade);
    }

    /**
     * Verifica se é usuário português
     */
    public boolean isPortugues() {
        return "PT".equals(nacionalidade);
    }

    /**
     * Obtém nome completo
     */
    public String getNomeCompleto() {
        return nome + " " + sobrenome;
    }
}
