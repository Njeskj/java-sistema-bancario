-- Cria tabela de refresh tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    created_date TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    INDEX idx_token (token),
    INDEX idx_username (username),
    INDEX idx_expiry (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
