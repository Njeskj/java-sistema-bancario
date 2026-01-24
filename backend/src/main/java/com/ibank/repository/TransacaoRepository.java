package com.ibank.repository;

import com.ibank.model.Transacao;
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

    @Query("SELECT t FROM Transacao t WHERE (t.contaOrigemId = :contaId OR t.contaDestinoId = :contaId) " +
           "AND t.dataHora BETWEEN :inicio AND :fim ORDER BY t.dataHora DESC")
    List<Transacao> findByContaAndPeriodo(
            @Param("contaId") Long contaId,
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim
    );

    @Query("SELECT SUM(t.valor) FROM Transacao t WHERE t.contaOrigemId = :contaId " +
           "AND t.tipo = :tipo AND DATE(t.dataHora) = :data")
    BigDecimal sumValorByContaAndTipoAndData(
            @Param("contaId") Long contaId,
            @Param("tipo") String tipo,
            @Param("data") LocalDate data
    );

    @Query("SELECT t FROM Transacao t WHERE t.contaOrigemId = :contaId ORDER BY t.dataHora DESC")
    List<Transacao> findByContaOrigemId(@Param("contaId") Long contaId);

    @Query("SELECT t FROM Transacao t WHERE t.contaDestinoId = :contaId ORDER BY t.dataHora DESC")
    List<Transacao> findByContaDestinoId(@Param("contaId") Long contaId);

    @Query("SELECT t FROM Transacao t WHERE t.status = :status ORDER BY t.dataHora DESC")
    List<Transacao> findByStatus(@Param("status") Transacao.StatusTransacao status);

    @Query("SELECT COUNT(t) FROM Transacao t WHERE t.contaOrigemId = :contaId " +
           "AND DATE(t.dataHora) = CURRENT_DATE")
    Long countTransacoesHoje(@Param("contaId") Long contaId);
}
