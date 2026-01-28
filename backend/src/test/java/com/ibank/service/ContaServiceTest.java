package com.ibank.service;

import com.ibank.dto.TransferenciaRequest;
import com.ibank.model.Conta;
import com.ibank.model.Transacao;
import com.ibank.repository.ContaRepository;
import com.ibank.repository.TransacaoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Testes unitários para ContaService
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("ContaService Tests")
class ContaServiceTest {

    @Mock
    private ContaRepository contaRepository;

    @Mock
    private TransacaoRepository transacaoRepository;

    @Mock
    private com.ibank.repository.UsuarioRepository usuarioRepository;

    @Mock
    private ExchangeRateService exchangeRateService;

    @InjectMocks
    private ContaService contaService;

    private Conta contaOrigem;
    private Conta contaDestino;

    @BeforeEach
    void setUp() {
        contaOrigem = new Conta();
        contaOrigem.setId(1L);
        contaOrigem.setSaldoBrl(new BigDecimal("1000.00"));
        contaOrigem.setMoedaPrincipal("BRL");
        contaOrigem.setLimiteTransferenciaDiario(new BigDecimal("5000.00"));

        contaDestino = new Conta();
        contaDestino.setId(2L);
        contaDestino.setSaldoBrl(new BigDecimal("500.00"));
        contaDestino.setMoedaPrincipal("BRL");
    }

    @Test
    @DisplayName("Deve realizar transferência com sucesso")
    void deveRealizarTransferenciaComSucesso() {
        // Arrange
        TransferenciaRequest request = new TransferenciaRequest();
        request.setContaOrigemId(1L);
        request.setDestinoIdentificador("BR1234567890123456789012345");
        request.setValor(new BigDecimal("100.00"));
        request.setMoeda("BRL");
        request.setTipoTransferencia("TED");
        request.setDescricao("Teste");

        when(contaRepository.findById(1L)).thenReturn(Optional.of(contaOrigem));
        when(contaRepository.findByIban("BR1234567890123456789012345")).thenReturn(Optional.of(contaDestino));
        when(transacaoRepository.sumValorByContaAndTipoAndData(anyLong(), any(), any()))
                .thenReturn(BigDecimal.ZERO);
        when(transacaoRepository.save(any(Transacao.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        Transacao resultado = contaService.realizarTransferencia(request);

        // Assert
        assertNotNull(resultado);
        assertEquals(new BigDecimal("900.00"), contaOrigem.getSaldoBrl());
        assertEquals(new BigDecimal("600.00"), contaDestino.getSaldoBrl());
        verify(contaRepository, times(2)).save(any(Conta.class));
        verify(transacaoRepository, times(1)).save(any(Transacao.class));
    }

    @Test
    @DisplayName("Deve lançar exceção quando saldo insuficiente")
    void deveLancarExcecaoQuandoSaldoInsuficiente() {
        // Arrange
        TransferenciaRequest request = new TransferenciaRequest();
        request.setContaOrigemId(1L);
        request.setValor(new BigDecimal("2000.00")); // Maior que o saldo
        request.setMoeda("BRL");
        request.setTipoTransferencia("TED");

        when(contaRepository.findById(1L)).thenReturn(Optional.of(contaOrigem));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            contaService.realizarTransferencia(request);
        });
        
        assertEquals("Saldo insuficiente", exception.getMessage());
        verify(contaRepository, never()).save(any(Conta.class));
        verify(transacaoRepository, never()).save(any(Transacao.class));
    }

    @Test
    @DisplayName("Deve realizar depósito com sucesso")
    void deveRealizarDepositoComSucesso() {
        // Arrange
        Long contaId = 1L;
        BigDecimal valor = new BigDecimal("500.00");
        String moeda = "BRL";

        when(contaRepository.findById(contaId)).thenReturn(Optional.of(contaOrigem));

        // Act
        contaService.depositar(contaId, valor, moeda);

        // Assert
        assertEquals(new BigDecimal("1500.00"), contaOrigem.getSaldoBrl());
        verify(contaRepository, times(1)).save(contaOrigem);
        verify(transacaoRepository, times(1)).save(any(Transacao.class));
    }

    @Test
    @DisplayName("Deve realizar saque com sucesso")
    void deveRealizarSaqueComSucesso() {
        // Arrange
        Long contaId = 1L;
        BigDecimal valor = new BigDecimal("200.00");
        String moeda = "BRL";
        
        contaOrigem.setLimiteSaqueDiario(new BigDecimal("1000.00"));

        when(contaRepository.findById(contaId)).thenReturn(Optional.of(contaOrigem));

        // Act
        contaService.sacar(contaId, valor, moeda);

        // Assert
        assertEquals(new BigDecimal("800.00"), contaOrigem.getSaldoBrl());
        verify(contaRepository, times(1)).save(contaOrigem);
        verify(transacaoRepository, times(1)).save(any(Transacao.class));
    }

    @Test
    @DisplayName("Deve lançar exceção quando conta não encontrada")
    void deveLancarExcecaoQuandoContaNaoEncontrada() {
        // Arrange
        when(contaRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            contaService.depositar(999L, new BigDecimal("100.00"), "BRL");
        });
        
        assertEquals("Conta não encontrada", exception.getMessage());
    }
}
