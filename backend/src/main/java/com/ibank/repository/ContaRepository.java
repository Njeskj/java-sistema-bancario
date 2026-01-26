package com.ibank.repository;

import com.ibank.model.Conta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContaRepository extends JpaRepository<Conta, Long> {
    
    @Query("SELECT c FROM Conta c LEFT JOIN FETCH c.usuario WHERE c.usuario.id = :usuarioId")
    List<Conta> findByUsuarioId(@Param("usuarioId") Long usuarioId);
    
    @Query("SELECT c FROM Conta c WHERE c.agencia = :agencia AND c.numeroConta = :numeroConta AND c.digitoVerificador = :digito")
    Optional<Conta> findByAgenciaAndNumeroContaAndDigito(
        @Param("agencia") String agencia,
        @Param("numeroConta") String numeroConta,
        @Param("digito") String digito
    );
    
    Optional<Conta> findByIban(String iban);
    
    @Query("SELECT c FROM Conta c WHERE c.usuario.id = :usuarioId AND c.statusConta = 'ATIVA'")
    List<Conta> findContasAtivasByUsuarioId(@Param("usuarioId") Long usuarioId);
    
    @Query("SELECT c FROM Conta c WHERE c.usuario.id = :usuarioId AND c.moedaPrincipal = :moeda")
    List<Conta> findByUsuarioIdAndMoeda(@Param("usuarioId") Long usuarioId, @Param("moeda") String moeda);
}
