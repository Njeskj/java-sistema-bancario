package com.ibank.service;

import com.ibank.dto.TransferenciaRequest;
import com.ibank.model.Conta;
import com.ibank.model.Transacao;
import com.ibank.model.Usuario;
import com.ibank.repository.ContaRepository;
import com.ibank.repository.TransacaoRepository;
import com.ibank.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContaService {

    private final ContaRepository contaRepository;
    private final TransacaoRepository transacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ExchangeRateService exchangeRateService;

    @Transactional
    public Transacao realizarTransferencia(TransferenciaRequest request) {
        // Buscar conta origem
        Conta contaOrigem = contaRepository.findById(request.getContaOrigemId())
                .orElseThrow(() -> new RuntimeException("Conta origem não encontrada"));

        // Validar saldo
        BigDecimal saldo = contaOrigem.getSaldo(request.getMoeda());
        if (saldo.compareTo(request.getValor()) < 0) {
            throw new RuntimeException("Saldo insuficiente");
        }

        // Validar limites
        validarLimites(contaOrigem, request);

        // Buscar conta destino
        Conta contaDestino = buscarContaDestino(request);
        if (contaDestino == null) {
            throw new RuntimeException("Conta destino não encontrada");
        }

        // Debitar da origem
        BigDecimal novoSaldoOrigem = saldo.subtract(request.getValor());
        contaOrigem.setSaldo(novoSaldoOrigem, request.getMoeda());
        contaRepository.save(contaOrigem);

        // Creditar no destino
        BigDecimal saldoDestino = contaDestino.getSaldo(request.getMoeda());
        BigDecimal novoSaldoDestino = saldoDestino.add(request.getValor());
        contaDestino.setSaldo(novoSaldoDestino, request.getMoeda());
        contaRepository.save(contaDestino);

        // Registrar transação
        Transacao transacao = Transacao.builder()
                .contaOrigem(contaOrigem)
                .contaDestino(contaDestino)
                .tipoTransacao(Transacao.TipoTransacao.valueOf(request.getTipoTransferencia()))
                .valor(request.getValor())
                .moeda(request.getMoeda())
                .descricao(request.getDescricao())
                .status(Transacao.StatusTransacao.CONCLUIDA)
                .dataTransacao(LocalDateTime.now())
                .saldoAnteriorOrigem(saldo)
                .saldoPosteriorOrigem(novoSaldoOrigem)
                .saldoAnteriorDestino(saldoDestino)
                .saldoPosteriorDestino(novoSaldoDestino)
                .build();

        return transacaoRepository.save(transacao);
    }

    @Transactional
    public void depositar(Long contaId, BigDecimal valor, String moeda) {
        Conta conta = contaRepository.findById(contaId)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        BigDecimal saldoAtual = conta.getSaldo(moeda);
        BigDecimal novoSaldo = saldoAtual.add(valor);
        conta.setSaldo(novoSaldo, moeda);
        contaRepository.save(conta);

        // Registrar transação
        Transacao transacao = Transacao.builder()
                .contaDestino(conta)
                .tipoTransacao(Transacao.TipoTransacao.DEPOSITO)
                .valor(valor)
                .moeda(moeda)
                .descricao("Depósito")
                .status(Transacao.StatusTransacao.CONCLUIDA)
                .dataTransacao(LocalDateTime.now())
                .saldoAnteriorDestino(saldoAtual)
                .saldoPosteriorDestino(novoSaldo)
                .build();

        transacaoRepository.save(transacao);
    }

    @Transactional
    public void sacar(Long contaId, BigDecimal valor, String moeda) {
        Conta conta = contaRepository.findById(contaId)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        BigDecimal saldoAtual = conta.getSaldo(moeda);
        if (saldoAtual.compareTo(valor) < 0) {
            throw new RuntimeException("Saldo insuficiente");
        }

        BigDecimal novoSaldo = saldoAtual.subtract(valor);
        conta.setSaldo(novoSaldo, moeda);
        contaRepository.save(conta);

        // Registrar transação
        Transacao transacao = Transacao.builder()
                .contaOrigem(conta)
                .tipoTransacao(Transacao.TipoTransacao.SAQUE)
                .valor(valor)
                .moeda(moeda)
                .descricao("Saque")
                .status(Transacao.StatusTransacao.CONCLUIDA)
                .dataTransacao(LocalDateTime.now())
                .saldoAnteriorOrigem(saldoAtual)
                .saldoPosteriorOrigem(novoSaldo)
                .build();

        transacaoRepository.save(transacao);
    }

    public List<Transacao> getExtrato(Long contaId, String dataInicio, String dataFim) {
        System.out.println("[DEBUG] ContaService.getExtrato - contaId: " + contaId);
        System.out.println("[DEBUG] dataInicio: " + dataInicio + ", dataFim: " + dataFim);
        
        LocalDateTime inicio = dataInicio != null 
                ? LocalDate.parse(dataInicio).atStartOfDay() 
                : LocalDateTime.now().minusDays(30);
        LocalDateTime fim = dataFim != null 
                ? LocalDate.parse(dataFim).atTime(23, 59, 59) 
                : LocalDateTime.now();

        System.out.println("[DEBUG] Buscando transações de " + inicio + " até " + fim);
        List<Transacao> resultado = transacaoRepository.findByContaAndPeriodo(contaId, inicio, fim);
        System.out.println("[DEBUG] Encontradas " + resultado.size() + " transações");
        
        return resultado;
    }

    public Page<Transacao> getExtratoPaginado(Long contaId, String dataInicio, String dataFim, Pageable pageable) {
        System.out.println("[DEBUG] ContaService.getExtratoPaginado - contaId: " + contaId);
        System.out.println("[DEBUG] Page: " + pageable.getPageNumber() + ", Size: " + pageable.getPageSize());
        
        LocalDateTime inicio = dataInicio != null 
                ? LocalDate.parse(dataInicio).atStartOfDay() 
                : LocalDateTime.now().minusDays(30);
        LocalDateTime fim = dataFim != null 
                ? LocalDate.parse(dataFim).atTime(23, 59, 59) 
                : LocalDateTime.now();

        System.out.println("[DEBUG] Buscando transações de " + inicio + " até " + fim);
        Page<Transacao> resultado = transacaoRepository.findByContaAndPeriodoPaginado(contaId, inicio, fim, pageable);
        System.out.println("[DEBUG] Página " + resultado.getNumber() + " com " + resultado.getNumberOfElements() + " transações de " + resultado.getTotalElements() + " total");
        
        return resultado;
    }

    private void validarLimites(Conta conta, TransferenciaRequest request) {
        LocalDate hoje = LocalDate.now();
        Transacao.TipoTransacao tipo = Transacao.TipoTransacao.valueOf(request.getTipoTransferencia());
        BigDecimal totalTransferencias = transacaoRepository
                .sumValorByContaAndTipoAndData(conta.getId(), tipo, hoje);

        BigDecimal limiteAtual = totalTransferencias != null ? totalTransferencias : BigDecimal.ZERO;
        BigDecimal novoTotal = limiteAtual.add(request.getValor());

        BigDecimal limite = switch (request.getTipoTransferencia()) {
            case "PIX" -> conta.getLimitePixDiario();
            case "TED", "DOC" -> conta.getLimiteTransferenciaDiario();
            default -> BigDecimal.valueOf(999999);
        };

        if (novoTotal.compareTo(limite) > 0) {
            throw new RuntimeException("Limite diário excedido para " + request.getTipoTransferencia());
        }
    }

    private Conta buscarContaDestino(TransferenciaRequest request) {
        String destino = request.getDestinoIdentificador();

        // Tentar buscar por chave PIX primeiro
        if (request.getTipoTransferencia().equals("PIX")) {
            // Aqui seria uma busca na tabela de chaves PIX
            // Simplificado: buscar por conta
        }

        // Buscar por número de conta (agencia-conta-digito)
        if (destino.contains("-")) {
            String[] partes = destino.split("-");
            if (partes.length == 3) {
                return contaRepository.findByAgenciaAndNumeroContaAndDigito(
                        partes[0], partes[1], partes[2]
                ).orElse(null);
            }
        }

        // Buscar por IBAN (internacional)
        return contaRepository.findByIban(destino).orElse(null);
    }
}
