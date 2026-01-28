package com.ibank.repository;

import com.ibank.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    
    Optional<RefreshToken> findByToken(String token);
    
    Optional<RefreshToken> findByUsername(String username);
    
    void deleteByUsername(String username);
    
    void deleteByExpiryDateBefore(Instant now);
}
