package com.ibank.filter;

import com.ibank.config.RateLimitingConfig;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro de Rate Limiting
 * Aplica limites diferentes baseado no tipo de endpoint
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final RateLimitingConfig rateLimitingConfig;

    public RateLimitingFilter(RateLimitingConfig rateLimitingConfig) {
        this.rateLimitingConfig = rateLimitingConfig;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) throws ServletException, IOException {
        
        String clientIp = getClientIP(request);
        String path = request.getRequestURI();
        
        Bucket bucket;
        
        // Aplica rate limit específico baseado no endpoint
        if (path.startsWith("/api/auth/login") || path.startsWith("/api/auth/register")) {
            bucket = rateLimitingConfig.resolveAuthBucket(clientIp);
        } else if (path.startsWith("/api/contas/transferir") || path.startsWith("/api/contas/sacar")) {
            bucket = rateLimitingConfig.resolveSensitiveBucket(clientIp);
        } else {
            // Endpoints gerais não aplicam rate limit rigoroso
            filterChain.doFilter(request, response);
            return;
        }
        
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        
        if (probe.isConsumed()) {
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            filterChain.doFilter(request, response);
        } else {
            long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000;
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.addHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(waitForRefill));
            response.getWriter().write("{\"error\": \"Too many requests. Try again in " + waitForRefill + " seconds.\"}");
        }
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
