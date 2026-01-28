package com.ibank.controller;

import com.ibank.dto.AuthResponse;
import com.ibank.dto.LoginRequest;
import com.ibank.dto.RefreshTokenRequest;
import com.ibank.dto.RegistroRequest;
import com.ibank.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:19006"})
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            System.out.println("[CONTROLLER] Recebendo requisição de login para: " + request.getEmailOuCpf());
            AuthResponse response = authService.login(request);
            System.out.println("[CONTROLLER] Login bem-sucedido!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("[CONTROLLER] Erro no login: " + e.getClass().getName() + " - " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegistroRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String token) {
        authService.logout(token);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/2fa/enable")
    public ResponseEntity<AuthResponse> enable2FA(@RequestHeader("Authorization") String token) {
        AuthResponse response = authService.enable2FA(token);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/2fa/verify")
    public ResponseEntity<AuthResponse> verify2FA(
            @RequestHeader("Authorization") String token,
            @RequestParam String code) {
        AuthResponse response = authService.verify2FA(token, code);
        return ResponseEntity.ok(response);
    }
}
