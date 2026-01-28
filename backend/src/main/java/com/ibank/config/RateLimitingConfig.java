package com.ibank.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Configuração de Rate Limiting usando Bucket4j
 * Protege contra ataques de brute force
 */
@Configuration
public class RateLimitingConfig {

    /**
     * Cache em memória para armazenar buckets por IP
     * Em produção, considere usar Redis para distribuído
     */
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    /**
     * Cria bucket para requisições gerais
     * 100 requisições por minuto por IP
     */
    @Bean
    public Bucket generalBucket() {
        Bandwidth limit = Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    /**
     * Cria bucket para login/autenticação
     * 5 tentativas por minuto por IP
     */
    public Bucket resolveAuthBucket(String key) {
        return cache.computeIfAbsent(key, k -> createAuthBucket());
    }

    private Bucket createAuthBucket() {
        Bandwidth limit = Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    /**
     * Cria bucket para operações sensíveis (transferências)
     * 20 requisições por minuto por IP
     */
    public Bucket resolveSensitiveBucket(String key) {
        return cache.computeIfAbsent(key, k -> createSensitiveBucket());
    }

    private Bucket createSensitiveBucket() {
        Bandwidth limit = Bandwidth.classic(20, Refill.intervally(20, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
}
