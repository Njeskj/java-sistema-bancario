package com.ibank.service;

import com.ibank.model.RefreshToken;
import com.ibank.repository.RefreshTokenRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

/**
 * Service para gerenciamento de refresh tokens
 */
@Service
public class RefreshTokenService {

    @Value("${jwt.refresh-expiration}")
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    /**
     * Cria um novo refresh token para o usuário
     */
    public RefreshToken createRefreshToken(String username) {
        // Remove token anterior se existir
        refreshTokenRepository.findByUsername(username)
                .ifPresent(refreshTokenRepository::delete);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUsername(username);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setCreatedDate(Instant.now());
        refreshToken.setRevoked(false);

        return refreshTokenRepository.save(refreshToken);
    }

    /**
     * Busca refresh token por token string
     */
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    /**
     * Verifica se o token expirou
     */
    public boolean isTokenExpired(RefreshToken token) {
        return token.getExpiryDate().compareTo(Instant.now()) < 0;
    }

    /**
     * Verifica se o token é válido (não expirado e não revogado)
     */
    public boolean isTokenValid(RefreshToken token) {
        return !token.isRevoked() && !isTokenExpired(token);
    }

    /**
     * Revoga um refresh token
     */
    @Transactional
    public void revokeToken(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(refreshToken -> {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
        });
    }

    /**
     * Remove tokens expirados - executa diariamente
     */
    @Scheduled(cron = "0 0 2 * * ?") // 2 AM todos os dias
    @Transactional
    public void cleanExpiredTokens() {
        refreshTokenRepository.deleteByExpiryDateBefore(Instant.now());
    }
}
