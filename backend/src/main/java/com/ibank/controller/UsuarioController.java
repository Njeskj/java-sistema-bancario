package com.ibank.controller;

import com.ibank.dto.UsuarioDTO;
import com.ibank.model.Usuario;
import com.ibank.model.Conta;
import com.ibank.repository.UsuarioRepository;
import com.ibank.repository.ContaRepository;
import com.ibank.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/usuario")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:19006", "http://java.local:3000"})
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final ContaRepository contaRepository;
    private final JwtUtil jwtUtil;

    @GetMapping("/perfil")
    public ResponseEntity<Map<String, Object>> getPerfil(@RequestHeader("Authorization") String authHeader) {
        try {
            System.out.println("[DEBUG] getPerfil chamado");
            System.out.println("[DEBUG] Authorization header: " + authHeader);
            
            // Remove "Bearer " do token
            String token = authHeader.replace("Bearer ", "");
            System.out.println("[DEBUG] Token extraído: " + token.substring(0, Math.min(50, token.length())) + "...");
            
            // Extrai o ID do usuário do token
            Long userId = jwtUtil.extractUserId(token);
            System.out.println("[DEBUG] UserId extraído do token: " + userId);
            
            // Busca o usuário
            Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            
            System.out.println("[DEBUG] Usuário encontrado: " + usuario.getEmail());
            
            // Busca a conta principal do usuário
            Conta conta = contaRepository.findByUsuarioId(usuario.getId())
                .stream()
                .findFirst()
                .orElse(null);
            
            System.out.println("[DEBUG] Conta encontrada: " + (conta != null ? conta.getId() : "null"));
            
            // Monta resposta
            Map<String, Object> response = new HashMap<>();
            
            // Dados pessoais
            response.put("id", usuario.getId());
            response.put("nome", usuario.getNome());
            response.put("sobrenome", usuario.getSobrenome());
            response.put("nomeCompleto", usuario.getNomeCompleto());
            response.put("email", usuario.getEmail());
            response.put("cpf", usuario.getCpf());
            response.put("telefone", usuario.getTelefone());
            response.put("telefonePais", usuario.getTelefonePais());
            response.put("dataNascimento", usuario.getDataNascimento());
            response.put("sexo", usuario.getSexo());
            
            // Endereço
            Map<String, Object> endereco = new HashMap<>();
            endereco.put("logradouro", usuario.getEnderecoLogradouro());
            endereco.put("numero", usuario.getEnderecoNumero());
            endereco.put("complemento", usuario.getEnderecoComplemento());
            endereco.put("bairro", usuario.getEnderecoBairro());
            endereco.put("cidade", usuario.getEnderecoCidade());
            endereco.put("estado", usuario.getEnderecoEstado());
            endereco.put("cep", usuario.getEnderecoCep());
            endereco.put("pais", usuario.getEnderecoPais());
            response.put("endereco", endereco);
            
            // Profissional
            response.put("profissao", usuario.getProfissao());
            response.put("empresa", usuario.getEmpresa());
            response.put("cargo", usuario.getCargo());
            response.put("rendaMensal", usuario.getRendaMensal());
            
            // Preferências
            response.put("idioma", usuario.getIdioma());
            response.put("moedaPreferencial", usuario.getMoedaPreferencial());
            
            // Segurança
            response.put("doisFatoresAtivo", usuario.isDoisFatoresAtivo());
            response.put("dataUltimoLogin", usuario.getDataUltimoLogin());
            
            // Dados da conta (se existir)
            if (conta != null) {
                Map<String, Object> dadosConta = new HashMap<>();
                dadosConta.put("agencia", conta.getAgencia());
                dadosConta.put("numeroConta", conta.getNumeroConta());
                dadosConta.put("digitoVerificador", conta.getDigitoVerificador());
                dadosConta.put("tipoConta", conta.getTipoConta());
                dadosConta.put("limitePixDiario", conta.getLimitePixDiario());
                dadosConta.put("limiteTransferenciaDiario", conta.getLimiteTransferenciaDiario());
                dadosConta.put("limiteInternacionalDiario", conta.getLimiteInternacionalDiario());
                dadosConta.put("limiteSaqueDiario", conta.getLimiteSaqueDiario());
                dadosConta.put("biometriaAtiva", conta.getBiometriaAtiva());
                dadosConta.put("requer2faTransacoes", conta.getRequer2faTransacoes());
                response.put("conta", dadosConta);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("[ERRO] Erro ao buscar perfil: " + e.getMessage());
            System.out.println("[ERRO] Tipo: " + e.getClass().getName());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("erro", e.getMessage());
            errorResponse.put("tipo", e.getClass().getSimpleName());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @PutMapping("/perfil")
    public ResponseEntity<Map<String, Object>> updatePerfil(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> updates) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Long userId = jwtUtil.extractUserId(token);
            
            Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            
            // Atualiza campos permitidos
            if (updates.containsKey("nome")) usuario.setNome((String) updates.get("nome"));
            if (updates.containsKey("sobrenome")) usuario.setSobrenome((String) updates.get("sobrenome"));
            if (updates.containsKey("telefone")) usuario.setTelefone((String) updates.get("telefone"));
            if (updates.containsKey("idioma")) usuario.setIdioma((String) updates.get("idioma"));
            if (updates.containsKey("moedaPreferencial")) usuario.setMoedaPreferencial((String) updates.get("moedaPreferencial"));
            
            usuarioRepository.save(usuario);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Perfil atualizado com sucesso");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("[ERRO] Erro ao atualizar perfil: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
    
    @PutMapping("/limites")
    public ResponseEntity<Map<String, Object>> updateLimites(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> limites) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Long userId = jwtUtil.extractUserId(token);
            
            Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            
            Conta conta = contaRepository.findByUsuarioId(userId)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));
            
            // Atualiza limites
            if (limites.containsKey("limitePixDiario")) {
                conta.setLimitePixDiario(new java.math.BigDecimal(limites.get("limitePixDiario").toString()));
            }
            if (limites.containsKey("limiteTransferenciaDiario")) {
                conta.setLimiteTransferenciaDiario(new java.math.BigDecimal(limites.get("limiteTransferenciaDiario").toString()));
            }
            if (limites.containsKey("limiteInternacionalDiario")) {
                conta.setLimiteInternacionalDiario(new java.math.BigDecimal(limites.get("limiteInternacionalDiario").toString()));
            }
            if (limites.containsKey("limiteSaqueDiario")) {
                conta.setLimiteSaqueDiario(new java.math.BigDecimal(limites.get("limiteSaqueDiario").toString()));
            }
            
            contaRepository.save(conta);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Limites atualizados com sucesso");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("[ERRO] Erro ao atualizar limites: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
}
