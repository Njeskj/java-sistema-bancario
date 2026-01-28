package com.ibank.repository;

import com.ibank.model.Transacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

    @Query("SELECT t FROM Transacao t WHERE (t.contaOrigem.id = :contaId OR t.contaDestino.id = :contaId) " +
           "AND t.dataTransacao BETWEEN :inicio AND :fim ORDER BY t.dataTransacao DESC")
    List<Transacao> findByContaAndPeriodo(
            @Param("contaId") Long contaId,
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim
    );

    @Query("SELECT t FROM Transacao t WHERE (t.contaOrigem.id = :contaId OR t.contaDestino.id = :contaId) " +
           "AND t.dataTransacao BETWEEN :inicio AND :fim")
    Page<Transacao> findByContaAndPeriodoPaginado(
            @Param("contaId") Long contaId,
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim,
            Pageable pageable
    );

    @Query("SELECT SUM(t.valor) FROM Transacao t WHERE t.contaOrigem.id = :contaId " +
           "AND t.tipoTransacao = :tipo AND DATE(t.dataTransacao) = :data")
    BigDecimal sumValorByContaAndTipoAndData(
            @Param("contaId") Long contaId,
            @Param("tipo") Transacao.TipoTransacao tipo,
            @Param("data") LocalDate data
    );

    @Query("SELECT t FROM Transacao t WHERE t.contaOrigem.id = :contaId ORDER BY t.dataTransacao DESC")
    List<Transacao> findByContaOrigemId(@Param("contaId") Long contaId);

    @Query("SELECT t FROM Transacao t WHERE t.contaDestino.id = :contaId ORDER BY t.dataTransacao DESC")
    List<Transacao> findByContaDestinoId(@Param("contaId") Long contaId);

    @Query("SELECT t FROM Transacao t WHERE t.status = :status ORDER BY t.dataTransacao DESC")
    List<Transacao> findByStatus(@Param("status") Transacao.StatusTransacao status);

    @Query("SELECT COUNT(t) FROM Transacao t WHERE t.contaOrigem.id = :contaId " +
           "AND DATE(t.dataTransacao) = CURRENT_DATE")
    Long countTransacoesHoje(@Param("contaId") Long contaId);
}
