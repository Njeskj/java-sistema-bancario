package com.ibank.controller;

import com.ibank.dto.AuthResponse;
import com.ibank.dto.LoginRequest;
import com.ibank.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * Testes unitários para AuthController
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthController Unit Tests")
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("POST /api/auth/login - Sucesso")
    void deveRealizarLoginComSucesso() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmailOuCpf("teste@example.com");
        request.setSenha("senha123");

        AuthResponse response = AuthResponse.builder()
                .token("mock-jwt-token")
                .tipo("Bearer")
                .usuarioId(1L)
                .build();

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        // Act
        ResponseEntity<AuthResponse> result = authController.login(request);

        // Assert
        assertNotNull(result);
        assertEquals(200, result.getStatusCodeValue());
        assertNotNull(result.getBody());
        assertEquals("mock-jwt-token", result.getBody().getToken());
        assertEquals("Bearer", result.getBody().getTipo());
        assertEquals(1L, result.getBody().getUsuarioId());
    }

    @Test
    @DisplayName("POST /api/auth/login - Falha por credenciais inválidas")
    void deveFalharQuandoCredenciaisInvalidas() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmailOuCpf("teste@example.com");
        request.setSenha("senhaErrada");

        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new RuntimeException("Senha incorreta"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> authController.login(request));
    }
}
