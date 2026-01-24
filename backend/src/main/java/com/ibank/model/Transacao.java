package com.ibank.model;

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
@Table(name = "transacoes")
public class Transacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conta_origem_id")
    private Conta contaOrigem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conta_destino_id")
    private Conta contaDestino;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_transacao", nullable = false)
    private TipoTransacao tipoTransacao;

    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal valor;

    @Column(length = 3)
    private String moeda = "BRL";

    @Column(name = "taxa_cambio", precision = 10, scale = 6)
    private BigDecimal taxaCambio = BigDecimal.ONE;

    @Column(name = "valor_convertido", precision = 15, scale = 2)
    private BigDecimal valorConvertido;

    @Column(name = "moeda_destino", length = 3)
    private String moedaDestino;

    @Column(precision = 10, scale = 2)
    private BigDecimal tarifa = BigDecimal.ZERO;

    @Column(name = "taxa_iof", precision = 10, scale = 2)
    private BigDecimal taxaIof = BigDecimal.ZERO;

    @Column(name = "saldo_anterior_origem", precision = 15, scale = 2)
    private BigDecimal saldoAnteriorOrigem;

    @Column(name = "saldo_posterior_origem", precision = 15, scale = 2)
    private BigDecimal saldoPosteriorOrigem;

    @Column(name = "saldo_anterior_destino", precision = 15, scale = 2)
    private BigDecimal saldoAnteriorDestino;

    @Column(name = "saldo_posterior_destino", precision = 15, scale = 2)
    private BigDecimal saldoPosteriorDestino;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "chave_pix", length = 100)
    private String chavePix;

    @Column(name = "codigo_autorizacao", length = 50)
    private String codigoAutorizacao;

    @Column(name = "id_transacao_externa", length = 100)
    private String idTransacaoExterna;

    @Column(name = "swift_reference", length = 35)
    private String swiftReference;

    @Column(name = "iban_destino", length = 34)
    private String ibanDestino;

    @Column(name = "banco_destino", length = 100)
    private String bancoDestino;

    @Column(name = "pais_destino", length = 2)
    private String paisDestino;

    @Enumerated(EnumType.STRING)
    private StatusTransacao status = StatusTransacao.PENDENTE;

    @Column(name = "motivo_falha", columnDefinition = "TEXT")
    private String motivoFalha;

    @Column(name = "ip_origem", length = 45)
    private String ipOrigem;

    @Column(length = 50)
    private String dispositivo;

    @Column(length = 255)
    private String localizacao;

    @Column(name = "requer_aprovacao")
    private Boolean requerAprovacao = false;

    @Column(name = "aprovada_por")
    private Long aprovadaPor;

    @Column(name = "data_aprovacao")
    private LocalDateTime dataAprovacao;

    @Column(name = "score_fraude", precision = 5, scale = 2)
    private BigDecimal scoreFraude;

    @Column(name = "data_transacao")
    private LocalDateTime dataTransacao;

    @Column(name = "data_processamento")
    private LocalDateTime dataProcessamento;

    @Column(name = "data_agendamento")
    private LocalDateTime dataAgendamento;

    @PrePersist
    protected void onCreate() {
        dataTransacao = LocalDateTime.now();
    }

    public enum TipoTransacao {
        DEPOSITO("Depósito"),
        SAQUE("Saque"),
        TRANSFERENCIA("Transferência"),
        PIX("PIX"),
        TED("TED"),
        DOC("DOC"),
        PAGAMENTO("Pagamento"),
        COMPRA_DEBITO("Compra Débito"),
        COMPRA_CREDITO("Compra Crédito"),
        TRANSFERENCIA_INTERNACIONAL("Transferência Internacional"),
        CAMBIO("Câmbio"),
        EMPRESTIMO("Empréstimo"),
        INVESTIMENTO("Investimento"),
        RESGATE("Resgate"),
        RENDIMENTO("Rendimento");

        private final String descricao;

        TipoTransacao(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    public enum StatusTransacao {
        PENDENTE, PROCESSANDO, CONCLUIDA, CANCELADA, FALHA, AGENDADA, ESTORNADA
    }
}
