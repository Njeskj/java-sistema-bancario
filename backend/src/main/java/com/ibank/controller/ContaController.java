package com.ibank.controller;

import com.ibank.dto.ContaResponse;
import com.ibank.dto.TransferenciaRequest;
import com.ibank.model.Conta;
import com.ibank.model.Transacao;
import com.ibank.repository.ContaRepository;
import com.ibank.service.ContaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/contas")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:19006", "http://java.local:3000"})
@RequiredArgsConstructor
public class ContaController {

    private final ContaService contaService;
    private final ContaRepository contaRepository;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> getContasByUsuario(@PathVariable Long usuarioId) {
        try {
            List<Conta> contas = contaRepository.findByUsuarioId(usuarioId);
            List<ContaResponse> response = contas.stream()
                .map(this::toContaResponse)
                .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "erro", e.getMessage(),
                "tipo", e.getClass().getSimpleName()
            ));
        }
    }

    private ContaResponse toContaResponse(Conta conta) {
        return ContaResponse.builder()
            .id(conta.getId())
            .banco(conta.getBanco())
            .agencia(conta.getAgencia())
            .numeroConta(conta.getNumeroConta())
            .digitoVerificador(conta.getDigitoVerificador())
            .tipoConta(conta.getTipoConta() != null ? conta.getTipoConta().name() : null)
            .saldoBrl(conta.getSaldoBrl())
            .saldoEur(conta.getSaldoEur())
            .saldoUsd(conta.getSaldoUsd())
            .moedaPrincipal(conta.getMoedaPrincipal())
            .ativa(true)
            .build();
    }

    @GetMapping("/{contaId}")
    public ResponseEntity<Conta> getContaById(@PathVariable Long contaId) {
        return contaRepository.findById(contaId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{contaId}/saldo")
    public ResponseEntity<Map<String, Object>> getSaldo(@PathVariable Long contaId) {
        return contaRepository.findById(contaId)
                .map(conta -> {
                    Map<String, Object> saldo = Map.of(
                            "saldoBrl", conta.getSaldoBrl(),
                            "saldoEur", conta.getSaldoEur(),
                            "saldoUsd", conta.getSaldoUsd(),
                            "moedaPrincipal", conta.getMoedaPrincipal(),
                            "saldoPrincipal", conta.getSaldo(conta.getMoedaPrincipal())
                    );
                    return ResponseEntity.ok(saldo);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/transferencia")
    public ResponseEntity<?> realizarTransferencia(@Valid @RequestBody TransferenciaRequest request) {
        try {
            Transacao transacao = contaService.realizarTransferencia(request);
            return ResponseEntity.ok(Map.of(
                    "sucesso", true,
                    "mensagem", "Transferência realizada com sucesso",
                    "transacao", transacao
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "sucesso", false,
                    "mensagem", e.getMessage()
            ));
        }
    }

    @PostMapping("/{contaId}/deposito")
    public ResponseEntity<?> depositar(
            @PathVariable Long contaId,
            @RequestParam BigDecimal valor,
            @RequestParam String moeda) {
        try {
            contaService.depositar(contaId, valor, moeda);
            return ResponseEntity.ok(Map.of(
                    "sucesso", true,
                    "mensagem", "Depósito realizado com sucesso"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "sucesso", false,
                    "mensagem", e.getMessage()
            ));
        }
    }

    @PostMapping("/{contaId}/saque")
    public ResponseEntity<?> sacar(
            @PathVariable Long contaId,
            @RequestParam BigDecimal valor,
            @RequestParam String moeda) {
        try {
            contaService.sacar(contaId, valor, moeda);
            return ResponseEntity.ok(Map.of(
                    "sucesso", true,
                    "mensagem", "Saque realizado com sucesso"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "sucesso", false,
                    "mensagem", e.getMessage()
            ));
        }
    }

    @GetMapping("/{contaId}/extrato")
    public ResponseEntity<?> getExtrato(
            @PathVariable Long contaId,
            @RequestParam(required = false) String dataInicio,
            @RequestParam(required = false) String dataFim,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "dataTransacao,desc") String sort) {
        try {
            System.out.println("[DEBUG] getExtrato chamado - contaId: " + contaId + ", page: " + page + ", size: " + size);
            
            // Parse sort parameter
            String[] sortParams = sort.split(",");
            Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc") 
                ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortParams[0]));
            
            Page<Transacao> extratoPage = contaService.getExtratoPaginado(contaId, dataInicio, dataFim, pageable);
            
            Map<String, Object> response = Map.of(
                "content", extratoPage.getContent(),
                "totalElements", extratoPage.getTotalElements(),
                "totalPages", extratoPage.getTotalPages(),
                "currentPage", extratoPage.getNumber(),
                "pageSize", extratoPage.getSize(),
                "hasNext", extratoPage.hasNext(),
                "hasPrevious", extratoPage.hasPrevious()
            );
            
            System.out.println("[DEBUG] Extrato retornou " + extratoPage.getNumberOfElements() + " transações da página " + page);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("[ERRO] Erro ao buscar extrato: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "sucesso", false,
                    "mensagem", e.getMessage()
            ));
        }
    }

    @PutMapping("/{contaId}/limites")
    public ResponseEntity<?> atualizarLimites(
            @PathVariable Long contaId,
            @RequestBody Map<String, BigDecimal> limites) {
        try {
            Conta conta = contaRepository.findById(contaId)
                    .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

            if (limites.containsKey("limitePixDiario")) {
                conta.setLimitePixDiario(limites.get("limitePixDiario"));
            }
            if (limites.containsKey("limiteTransferenciaDiario")) {
                conta.setLimiteTransferenciaDiario(limites.get("limiteTransferenciaDiario"));
            }
            if (limites.containsKey("limiteSaqueDiario")) {
                conta.setLimiteSaqueDiario(limites.get("limiteSaqueDiario"));
            }

            contaRepository.save(conta);

            return ResponseEntity.ok(Map.of(
                    "sucesso", true,
                    "mensagem", "Limites atualizados com sucesso"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "sucesso", false,
                    "mensagem", e.getMessage()
            ));
        }
    }
}
