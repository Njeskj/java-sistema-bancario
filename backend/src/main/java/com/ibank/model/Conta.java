package com.ibank.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "contas")
public class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnoreProperties({"contas", "senha", "senhaHash", "handler", "hibernateLazyInitializer"})
    private Usuario usuario;

    @Column(nullable = false, length = 50)
    private String banco;

    @Column(nullable = false, length = 10)
    private String agencia;

    @Column(name = "numero_conta", nullable = false, length = 20)
    private String numeroConta;

    @Column(name = "digito_verificador", nullable = false, length = 2)
    private String digitoVerificador;

    @Column(length = 34)
    private String iban;

    @Column(name = "swift_bic", length = 11)
    private String swiftBic;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_conta")
    private TipoConta tipoConta;

    @Column(nullable = false)
    private String titular;

    @Column(name = "cpf_titular", nullable = false)
    private String cpfTitular;

    @Column(name = "saldo_brl", precision = 15, scale = 2)
    private BigDecimal saldoBrl = BigDecimal.ZERO;

    @Column(name = "saldo_eur", precision = 15, scale = 2)
    private BigDecimal saldoEur = BigDecimal.ZERO;

    @Column(name = "saldo_usd", precision = 15, scale = 2)
    private BigDecimal saldoUsd = BigDecimal.ZERO;

    @Column(name = "moeda_principal", length = 3)
    private String moedaPrincipal = "BRL";

    @Column(name = "limite_credito", precision = 15, scale = 2)
    private BigDecimal limiteCredito = BigDecimal.ZERO;

    @Column(name = "limite_pix_diario", precision = 15, scale = 2)
    private BigDecimal limitePixDiario = new BigDecimal("5000.00");

    @Column(name = "limite_transferencia_diario", precision = 15, scale = 2)
    private BigDecimal limiteTransferenciaDiario = new BigDecimal("10000.00");

    @Column(name = "limite_internacional_diario", precision = 15, scale = 2)
    private BigDecimal limiteInternacionalDiario = new BigDecimal("3000.00");

    @Column(name = "limite_saque_diario", precision = 15, scale = 2)
    private BigDecimal limiteSaqueDiario = new BigDecimal("2000.00");

    @Column(name = "codigo_seguranca_hash", nullable = false)
    private String codigoSegurancaHash;

    @Column(name = "requer_2fa_transacoes")
    private Boolean requer2faTransacoes = false;

    @Column(name = "biometria_ativa")
    private Boolean biometriaAtiva = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_conta")
    private StatusConta statusConta = StatusConta.ATIVA;

    @Column(name = "pais_origem", nullable = false, length = 2)
    private String paisOrigem;

    @Column(name = "permite_internacional")
    private Boolean permiteInternacional = false;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    @Column(name = "ultima_atualizacao")
    private LocalDateTime ultimaAtualizacao;

    @Column(name = "data_ultimo_acesso")
    private LocalDateTime dataUltimoAcesso;

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        ultimaAtualizacao = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        ultimaAtualizacao = LocalDateTime.now();
    }

    public enum TipoConta {
        CORRENTE("Corrente"),
        POUPANCA("Poupança"),
        SALARIO("Salário"),
        INVESTIMENTO("Investimento"),
        UNIVERSITARIA("Universitária");

        private final String descricao;

        TipoConta(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    public enum StatusConta {
        ATIVA("Ativa"),
        BLOQUEADA("Bloqueada"),
        INATIVA("Inativa"),
        ENCERRADA("Encerrada");

        private final String descricao;

        StatusConta(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    /**
     * Obtém saldo na moeda principal
     */
    public BigDecimal getSaldoPrincipal() {
        switch (moedaPrincipal) {
            case "EUR":
                return saldoEur;
            case "USD":
                return saldoUsd;
            default:
                return saldoBrl;
        }
    }

    /**
     * Define saldo na moeda especificada
     */
    public void setSaldo(BigDecimal valor, String moeda) {
        switch (moeda) {
            case "EUR":
                saldoEur = valor;
                break;
            case "USD":
                saldoUsd = valor;
                break;
            default:
                saldoBrl = valor;
        }
    }

    /**
     * Obtém saldo na moeda especificada
     */
    public BigDecimal getSaldo(String moeda) {
        switch (moeda) {
            case "EUR":
                return saldoEur;
            case "USD":
                return saldoUsd;
            default:
                return saldoBrl;
        }
    }
}
