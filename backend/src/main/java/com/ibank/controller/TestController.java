package com.ibank.controller;

import com.ibank.model.Usuario;
import com.ibank.repository.UsuarioRepository;
import com.ibank.util.EncryptionUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final UsuarioRepository usuarioRepository;
    private final EncryptionUtil encryptionUtil;

    public TestController(UsuarioRepository usuarioRepository, EncryptionUtil encryptionUtil) {
        this.usuarioRepository = usuarioRepository;
        this.encryptionUtil = encryptionUtil;
    }

    @PostMapping("/hash")
    public Map<String, Object> testHash(@RequestBody Map<String, String> request) {
        String senha = request.get("senha");
        String hash = request.get("hash");
        
        Map<String, Object> result = new HashMap<>();
        result.put("senha", senha);
        result.put("hashFornecido", hash);
        result.put("matches", encoder.matches(senha, hash));
        result.put("novoHash", encoder.encode(senha));
        
        return result;
    }
    
    @GetMapping("/gerar/{senha}")
    public Map<String, String> gerarHash(@PathVariable String senha) {
        Map<String, String> result = new HashMap<>();
        result.put("senha", senha);
        result.put("hash", encoder.encode(senha));
        return result;
    }
    
    @PostMapping("/login-debug")
    public Map<String, Object> loginDebug(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String senha = request.get("senha");
        
        Map<String, Object> result = new HashMap<>();
        result.put("email", email);
        
        try {
            String emailHash = encryptionUtil.hash(email);
            result.put("emailHash", emailHash.substring(0, 30) + "...");
            
            Optional<Usuario> usuarioOpt = usuarioRepository.findActiveUsuarioByEmailHash(emailHash);
            if (usuarioOpt.isEmpty()) {
                result.put("erro", "Usuário não encontrado");
                return result;
            }
            
            Usuario usuario = usuarioOpt.get();
            result.put("usuarioId", usuario.getId());
            result.put("usuarioNome", usuario.getNome());
            result.put("senhaHashDB", usuario.getSenhaHash().substring(0, 40) + "...");
            
            boolean senhaCorreta = encoder.matches(senha, usuario.getSenhaHash());
            result.put("senhaMatches", senhaCorreta);
            
            if (!senhaCorreta) {
                // Testar com diferentes encoders
                BCryptPasswordEncoder encoder10 = new BCryptPasswordEncoder(10);
                BCryptPasswordEncoder encoder12 = new BCryptPasswordEncoder(12);
                result.put("matches_strength10", encoder10.matches(senha, usuario.getSenhaHash()));
                result.put("matches_strength12", encoder12.matches(senha, usuario.getSenhaHash()));
            }
            
        } catch (Exception e) {
            result.put("erro", e.getMessage());
            result.put("stackTrace", e.getClass().getName());
        }
        
        return result;
    }
}

