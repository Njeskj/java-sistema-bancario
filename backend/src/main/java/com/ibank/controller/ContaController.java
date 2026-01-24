package com.ibank.controller;

import com.ibank.dto.TransferenciaRequest;
import com.ibank.model.Conta;
import com.ibank.model.Transacao;
import com.ibank.repository.ContaRepository;
import com.ibank.service.ContaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contas")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:19006"})
@RequiredArgsConstructor
public class ContaController {

    private final ContaService contaService;
    private final ContaRepository contaRepository;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Conta>> getContasByUsuario(@PathVariable Long usuarioId) {
        List<Conta> contas = contaRepository.findByUsuarioId(usuarioId);
        return ResponseEntity.ok(contas);
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
            @RequestParam(required = false) String dataFim) {
        try {
            List<Transacao> extrato = contaService.getExtrato(contaId, dataInicio, dataFim);
            return ResponseEntity.ok(extrato);
        } catch (Exception e) {
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

            if (limites.containsKey("limiteDiarioPix")) {
                conta.setLimiteDiarioPix(limites.get("limiteDiarioPix"));
            }
            if (limites.containsKey("limiteDiarioTransferencia")) {
                conta.setLimiteDiarioTransferencia(limites.get("limiteDiarioTransferencia"));
            }
            if (limites.containsKey("limiteDiarioSaque")) {
                conta.setLimiteDiarioSaque(limites.get("limiteDiarioSaque"));
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
