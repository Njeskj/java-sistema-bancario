package com.ibank.service;

import com.ibank.dto.LoginRequest;
import com.ibank.model.Usuario;
import com.ibank.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Testes unitários para AuthService
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Tests")
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private com.ibank.util.EncryptionUtil encryptionUtil;

    @Mock
    private com.ibank.util.JwtUtil jwtUtil;

    @Mock
    private com.ibank.util.TwoFactorAuthUtil twoFactorAuthUtil;

    @Mock
    private RefreshTokenService refreshTokenService;

    @InjectMocks
    private AuthService authService;

    private Usuario mockUsuario;
    private BCryptPasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        
        mockUsuario = Usuario.builder()
                .id(1L)
                .nome("João")
                .sobrenome("Silva")
                .cpfHash("mock-cpf-hash")
                .emailHash("mock-email-hash")
                .email("encrypted-email")
                .senhaHash(passwordEncoder.encode("senha123"))
                .nacionalidade("BR")
                .moedaPreferencial("BRL")
                .idioma("pt-BR")
                .ativo(true)
                .contaBloqueada(false)
                .doisFatoresAtivo(false)
                .tentativasLoginFalhas(0)
                .build();
    }

    @Test
    @DisplayName("Deve realizar login com sucesso usando email")
    void deveRealizarLoginComSucessoUsandoEmail() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmailOuCpf("teste@example.com");
        request.setSenha("senha123");

        when(encryptionUtil.hash(anyString())).thenReturn("mock-email-hash");
        when(usuarioRepository.findActiveUsuarioByEmailHash(anyString())).thenReturn(Optional.of(mockUsuario));
        when(jwtUtil.generateToken(any(), anyLong(), anyString())).thenReturn("mock-jwt-token");
        when(refreshTokenService.createRefreshToken(anyString())).thenReturn(
            new com.ibank.model.RefreshToken(1L, "mock-refresh-token", "user", 
                java.time.Instant.now().plusSeconds(3600), java.time.Instant.now(), false)
        );

        // Act
        var response = authService.login(request);

        // Assert
        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("Bearer", response.getTipo());
        assertEquals(1L, response.getUsuarioId());
        assertFalse(response.isRequer2FA());
        
        verify(usuarioRepository, times(1)).findActiveUsuarioByEmailHash(anyString());
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    @DisplayName("Deve lançar exceção quando usuário não encontrado")
    void deveLancarExcecaoQuandoUsuarioNaoEncontrado() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmailOuCpf("naoexiste@example.com");
        request.setSenha("senha123");

        when(encryptionUtil.hash(anyString())).thenReturn("mock-hash");
        when(usuarioRepository.findActiveUsuarioByEmailHash(anyString())).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(request);
        });
        
        assertEquals("Usuário não encontrado ou inativo", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção quando senha incorreta")
    void deveLancarExcecaoQuandoSenhaIncorreta() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmailOuCpf("teste@example.com");
        request.setSenha("senhaErrada");

        when(encryptionUtil.hash(anyString())).thenReturn("mock-email-hash");
        when(usuarioRepository.findActiveUsuarioByEmailHash(anyString())).thenReturn(Optional.of(mockUsuario));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(request);
        });
        
        assertEquals("Senha incorreta", exception.getMessage());
    }

    // Teste comentado - requer implementação de bloqueio automático
    // @Test
    // @DisplayName("Deve bloquear conta após 5 tentativas falhas")
    // void devBloquearContaApos5TentativasFalhas() {
    //     ...
    // }
}
