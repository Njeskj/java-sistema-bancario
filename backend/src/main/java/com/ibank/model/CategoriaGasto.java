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
@Table(name = "categorias_gastos")
public class CategoriaGasto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transacao_id", nullable = false)
    private Transacao transacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Categoria categoria;

    @Column(length = 100)
    private String subcategoria;

    @Column(name = "valor", precision = 15, scale = 2, nullable = false)
    private BigDecimal valor;

    @Column(length = 3)
    private String moeda = "BRL";

    @Column(name = "categorizado_automaticamente")
    private Boolean categorizadoAutomaticamente = false;

    @Column(name = "score_confianca", precision = 5, scale = 2)
    private BigDecimal scoreConfianca; // 0-100, usado pela IA

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "data_categorizacao")
    private LocalDateTime dataCategorizacao;

    @PrePersist
    protected void onCreate() {
        dataCategorizacao = LocalDateTime.now();
    }

    public enum Categoria {
        ALIMENTACAO("Alimentação", "🍔", "#FF6B6B"),
        TRANSPORTE("Transporte", "🚗", "#4ECDC4"),
        MORADIA("Moradia", "🏠", "#95E1D3"),
        SAUDE("Saúde", "⚕️", "#F38181"),
        EDUCACAO("Educação", "📚", "#AA96DA"),
        LAZER("Lazer", "🎬", "#FCBAD3"),
        COMPRAS("Compras", "🛍️", "#FDCB9E"),
        VESTUARIO("Vestuário", "👔", "#A8E6CF"),
        SERVICOS("Serviços", "🔧", "#FFD3B6"),
        INVESTIMENTOS("Investimentos", "📈", "#FFAAA5"),
        IMPOSTOS("Impostos", "🏛️", "#FF8B94"),
        SEGUROS("Seguros", "🛡️", "#C7CEEA"),
        DOACAO("Doação", "💝", "#FFC6FF"),
        VIAGEM("Viagem", "✈️", "#BEE1E6"),
        PETS("Pets", "🐾", "#FFF4E6"),
        BELEZA("Beleza", "💄", "#FFE6E6"),
        TECNOLOGIA("Tecnologia", "💻", "#E0E7FF"),
        ASSINATURAS("Assinaturas", "📱", "#FFF0DB"),
        OUTROS("Outros", "📦", "#E5E5E5");

        private final String descricao;
        private final String icone;
        private final String cor;

        Categoria(String descricao, String icone, String cor) {
            this.descricao = descricao;
            this.icone = icone;
            this.cor = cor;
        }

        public String getDescricao() {
            return descricao;
        }

        public String getIcone() {
            return icone;
        }

        public String getCor() {
            return cor;
        }
    }
}
