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
@Table(name = "cashback")
public class Cashback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transacao_id")
    private Transacao transacao;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_operacao", nullable = false)
    private TipoOperacao tipoOperacao;

    @Column(name = "categoria", length = 50)
    private String categoria; // Alimentação, Transporte, Compras, etc

    @Column(name = "estabelecimento", length = 255)
    private String estabelecimento;

    @Column(name = "valor_transacao", precision = 15, scale = 2, nullable = false)
    private BigDecimal valorTransacao;

    @Column(name = "percentual_cashback", precision = 5, scale = 2, nullable = false)
    private BigDecimal percentualCashback;

    @Column(name = "valor_cashback", precision = 15, scale = 2, nullable = false)
    private BigDecimal valorCashback;

    @Column(length = 3)
    private String moeda = "BRL";

    @Enumerated(EnumType.STRING)
    private StatusCashback status = StatusCashback.PENDENTE;

    @Column(name = "data_credito")
    private LocalDateTime dataCredito;

    @Column(name = "data_expiracao")
    private LocalDateTime dataExpiracao;

    @Column(name = "campanha_id")
    private Long campanhaId;

    @Column(name = "campanha_nome", length = 255)
    private String campanhaNome;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        // Cashback expira em 12 meses
        dataExpiracao = LocalDateTime.now().plusMonths(12);
    }

    public enum TipoOperacao {
        COMPRA_DEBITO("Compra no Débito"),
        COMPRA_CREDITO("Compra no Crédito"),
        PAGAMENTO("Pagamento de Conta"),
        TRANSFERENCIA("Transferência"),
        RECARGA("Recarga");

        private final String descricao;

        TipoOperacao(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    public enum StatusCashback {
        PENDENTE, CREDITADO, EXPIRADO, CANCELADO
    }

    public boolean isExpirado() {
        return dataExpiracao != null && LocalDateTime.now().isAfter(dataExpiracao);
    }
}
