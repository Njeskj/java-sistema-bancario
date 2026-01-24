package com.ibank.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "metas_financeiras")
public class MetaFinanceira {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conta_id")
    private Conta conta;

    @Column(nullable = false, length = 255)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_meta", nullable = false)
    private TipoMeta tipoMeta;

    @Column(name = "valor_objetivo", precision = 15, scale = 2, nullable = false)
    private BigDecimal valorObjetivo;

    @Column(name = "valor_atual", precision = 15, scale = 2)
    private BigDecimal valorAtual = BigDecimal.ZERO;

    @Column(length = 3)
    private String moeda = "BRL";

    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_objetivo", nullable = false)
    private LocalDate dataObjetivo;

    @Column(name = "contribuicao_mensal", precision = 15, scale = 2)
    private BigDecimal contribuicaoMensal;

    @Enumerated(EnumType.STRING)
    private StatusMeta status = StatusMeta.EM_PROGRESSO;

    @Column(name = "percentual_concluido", precision = 5, scale = 2)
    private BigDecimal percentualConcluido = BigDecimal.ZERO;

    @Column(name = "contribuicao_automatica")
    private Boolean contribuicaoAutomatica = false;

    @Column(name = "dia_debito_automatico")
    private Integer diaDebitoAutomatico;

    @Column(name = "icone", length = 50)
    private String icone; // Emoji ou nome do ícone

    @Column(name = "cor", length = 7)
    private String cor; // Código hexadecimal

    @Column(name = "notificar_progresso")
    private Boolean notificarProgresso = true;

    @Column(name = "data_conclusao")
    private LocalDate dataConclusao;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    @Column(name = "ultima_atualizacao")
    private LocalDateTime ultimaAtualizacao;

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        ultimaAtualizacao = LocalDateTime.now();
        calcularPercentual();
    }

    @PreUpdate
    protected void onUpdate() {
        ultimaAtualizacao = LocalDateTime.now();
        calcularPercentual();
        verificarConclusao();
    }

    public enum TipoMeta {
        RESERVA_EMERGENCIA("Reserva de Emergência"),
        VIAGEM("Viagem"),
        CASA_PROPRIA("Casa Própria"),
        CARRO("Carro"),
        EDUCACAO("Educação"),
        APOSENTADORIA("Aposentadoria"),
        CASAMENTO("Casamento"),
        INVESTIMENTO("Investimento"),
        DIVIDA("Pagar Dívida"),
        OUTRO("Outro");

        private final String descricao;

        TipoMeta(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    public enum StatusMeta {
        EM_PROGRESSO, CONCLUIDA, PAUSADA, CANCELADA, ATRASADA
    }

    private void calcularPercentual() {
        if (valorObjetivo.compareTo(BigDecimal.ZERO) > 0) {
            percentualConcluido = valorAtual
                    .divide(valorObjetivo, 4, java.math.RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"))
                    .setScale(2, java.math.RoundingMode.HALF_UP);
        }
    }

    private void verificarConclusao() {
        if (valorAtual.compareTo(valorObjetivo) >= 0 && status == StatusMeta.EM_PROGRESSO) {
            status = StatusMeta.CONCLUIDA;
            dataConclusao = LocalDate.now();
        }
    }

    public void adicionarValor(BigDecimal valor) {
        this.valorAtual = this.valorAtual.add(valor);
    }

    public BigDecimal getValorFaltante() {
        return valorObjetivo.subtract(valorAtual).max(BigDecimal.ZERO);
    }

    public long getDiasRestantes() {
        return java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), dataObjetivo);
    }
}
