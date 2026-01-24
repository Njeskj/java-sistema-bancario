package com.ibank.service;

import com.ibank.dto.AuthResponse;
import com.ibank.dto.LoginRequest;
import com.ibank.dto.RegistroRequest;
import com.ibank.model.Usuario;
import com.ibank.repository.UsuarioRepository;
import com.ibank.util.EncryptionUtil;
import com.ibank.util.JwtUtil;
import com.ibank.util.TwoFactorAuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final EncryptionUtil encryptionUtil;
    private final JwtUtil jwtUtil;
    private final TwoFactorAuthUtil twoFactorAuthUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String cpfHash = encryptionUtil.hash(request.getCpf());
        
        Usuario usuario = usuarioRepository.findActiveUsuarioByCpfHash(cpfHash)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado ou inativo"));

        if (usuario.getContaBloqueada()) {
            throw new RuntimeException("Conta bloqueada. Entre em contato com o suporte.");
        }

        if (!passwordEncoder.matches(request.getSenha(), usuario.getSenhaHash())) {
            incrementarTentativasLogin(usuario);
            throw new RuntimeException("Senha incorreta");
        }

        if (usuario.getDoisFatoresAtivo()) {
            if (request.getCodigoTotp() == null || 
                !twoFactorAuthUtil.verifyCode(usuario.getDoisFatoresSecret(), request.getCodigoTotp())) {
                throw new RuntimeException("Código 2FA inválido");
            }
        }

        resetarTentativasLogin(usuario);
        
        String token = jwtUtil.generateToken(
            new org.springframework.security.core.userdetails.User(
                usuario.getCpfHash(), "", java.util.Collections.emptyList()
            ),
            usuario.getId(),
            usuario.getNacionalidade()
        );

        String refreshToken = jwtUtil.generateRefreshToken(
            new org.springframework.security.core.userdetails.User(
                usuario.getCpfHash(), "", java.util.Collections.emptyList()
            ),
            usuario.getId()
        );

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .tipo("Bearer")
                .usuarioId(usuario.getId())
                .nomeCompleto(usuario.getNomeCompleto())
                .email(encryptionUtil.decrypt(usuario.getEmail()))
                .nacionalidade(usuario.getNacionalidade())
                .moedaPreferencial(usuario.getMoedaPreferencial())
                .idioma(usuario.getIdioma())
                .requer2FA(usuario.getDoisFatoresAtivo())
                .build();
    }

    @Transactional
    public AuthResponse register(RegistroRequest request) {
        String cpfHash = encryptionUtil.hash(request.getCpf());
        String emailHash = encryptionUtil.hash(request.getEmail());

        if (usuarioRepository.existsByCpfHash(cpfHash)) {
            throw new RuntimeException("CPF/NIF já cadastrado");
        }

        if (usuarioRepository.existsByEmailHash(emailHash)) {
            throw new RuntimeException("Email já cadastrado");
        }

        String salt = encryptionUtil.generateSalt();
        
        Usuario usuario = Usuario.builder()
                .nome(request.getNome())
                .sobrenome(request.getSobrenome())
                .cpf(encryptionUtil.encrypt(request.getCpf()))
                .cpfHash(cpfHash)
                .email(encryptionUtil.encrypt(request.getEmail()))
                .emailHash(emailHash)
                .telefone(encryptionUtil.encrypt(request.getTelefone()))
                .telefonePais(request.getNacionalidade().equals("BR") ? "+55" : "+351")
                .senhaHash(passwordEncoder.encode(request.getSenha()))
                .salt(salt)
                .dataNascimento(request.getDataNascimento())
                .nacionalidade(request.getNacionalidade())
                .moedaPreferencial(request.getNacionalidade().equals("BR") ? "BRL" : "EUR")
                .idioma(request.getNacionalidade().equals("BR") ? "pt-BR" : "pt-PT")
                .enderecoCidade(request.getCidade())
                .enderecoPais(request.getNacionalidade())
                .ativo(true)
                .doisFatoresAtivo(false)
                .contaBloqueada(false)
                .tentativasLoginFalhas(0)
                .build();

        usuario = usuarioRepository.save(usuario);

        String token = jwtUtil.generateToken(
            new org.springframework.security.core.userdetails.User(
                usuario.getCpfHash(), "", java.util.Collections.emptyList()
            ),
            usuario.getId(),
            usuario.getNacionalidade()
        );

        return AuthResponse.builder()
                .token(token)
                .tipo("Bearer")
                .usuarioId(usuario.getId())
                .nomeCompleto(usuario.getNomeCompleto())
                .email(request.getEmail())
                .nacionalidade(usuario.getNacionalidade())
                .moedaPreferencial(usuario.getMoedaPreferencial())
                .idioma(usuario.getIdioma())
                .requer2FA(false)
                .build();
    }

    public AuthResponse refreshToken(String refreshToken) {
        // Implementar lógica de refresh
        throw new RuntimeException("Not implemented");
    }

    public void logout(String token) {
        // Implementar revogação de token
    }

    public AuthResponse enable2FA(String token) {
        Long usuarioId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        String secret = twoFactorAuthUtil.generateSecret();
        String email = encryptionUtil.decrypt(usuario.getEmail());
        String qrCode = twoFactorAuthUtil.generateQrCodeDataUri(secret, email, "IBank");

        usuario.setDoisFatoresSecret(secret);
        usuario.setDoisFatoresAtivo(true);
        usuarioRepository.save(usuario);

        return AuthResponse.builder()
                .qrCode2FA(qrCode)
                .requer2FA(true)
                .build();
    }

    public AuthResponse verify2FA(String token, String code) {
        Long usuarioId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!twoFactorAuthUtil.verifyCode(usuario.getDoisFatoresSecret(), code)) {
            throw new RuntimeException("Código 2FA inválido");
        }

        return AuthResponse.builder()
                .requer2FA(true)
                .build();
    }

    private void incrementarTentativasLogin(Usuario usuario) {
        usuario.setTentativasLoginFalhas(usuario.getTentativasLoginFalhas() + 1);
        if (usuario.getTentativasLoginFalhas() >= 5) {
            usuario.setContaBloqueada(true);
        }
        usuarioRepository.save(usuario);
    }

    private void resetarTentativasLogin(Usuario usuario) {
        usuario.setTentativasLoginFalhas(0);
        usuario.setDataUltimoLogin(LocalDateTime.now());
        usuarioRepository.save(usuario);
    }
}
