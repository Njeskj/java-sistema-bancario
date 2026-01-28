-- ================================================
-- Script de Sincronização do Schema do Banco de Dados
-- ================================================

USE java;

SET FOREIGN_KEY_CHECKS = 0;

-- ================================================
-- 1. ATUALIZAR TABELA USUARIOS
-- ================================================

-- Backup da tabela usuarios
DROP TABLE IF EXISTS usuarios_backup;
CREATE TABLE usuarios_backup AS SELECT * FROM usuarios;

-- Recriar tabela usuarios com schema correto
DROP TABLE IF EXISTS usuarios_new;
CREATE TABLE usuarios_new (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Dados Pessoais Básicos
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    cpf_hash VARCHAR(64) NOT NULL UNIQUE,
    rg VARCHAR(15),
    telefone VARCHAR(20),
    telefone_pais VARCHAR(5) DEFAULT '+55',
    email VARCHAR(100) UNIQUE,
    email_hash VARCHAR(64) NOT NULL UNIQUE,
    
    -- Autenticação
    senha_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    
    -- Dados Familiares
    nome_mae VARCHAR(100),
    nome_pai VARCHAR(100),
    
    -- Dados Pessoais Detalhados
    data_nascimento DATE,
    sexo VARCHAR(30),
    nacionalidade VARCHAR(2) DEFAULT 'BR',
    naturalidade VARCHAR(100),
    estado_civil VARCHAR(20),
    
    -- Dados Profissionais
    profissao VARCHAR(100),
    renda_mensal DECIMAL(15,2),
    empresa VARCHAR(150),
    cargo VARCHAR(100),
    
    -- Endereço
    endereco_logradouro VARCHAR(255),
    endereco_numero VARCHAR(20),
    endereco_complemento VARCHAR(100),
    endereco_bairro VARCHAR(100),
    endereco_cidade VARCHAR(100),
    endereco_estado VARCHAR(2),
    endereco_cep VARCHAR(10),
    endereco_pais VARCHAR(2) DEFAULT 'BR',
    
    -- Segurança
    dois_fatores_ativo BOOLEAN DEFAULT FALSE,
    dois_fatores_secret VARCHAR(255),
    tentativas_login_falhas INT DEFAULT 0,
    conta_bloqueada BOOLEAN DEFAULT FALSE,
    data_ultimo_login DATETIME,
    ip_ultimo_login VARCHAR(45),
    
    -- Preferências
    idioma VARCHAR(5) DEFAULT 'pt-BR',
    moeda_preferencial VARCHAR(3) DEFAULT 'BRL',
    
    -- Status e Auditoria
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao DATETIME NOT NULL,
    ultima_atualizacao DATETIME NOT NULL,
    criado_por VARCHAR(100),
    atualizado_por VARCHAR(100),
    
    INDEX idx_email_hash (email_hash),
    INDEX idx_cpf_hash (cpf_hash),
    INDEX idx_ativo (ativo),
    INDEX idx_data_criacao (data_criacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Migrar dados do backup para nova tabela
INSERT INTO usuarios_new (
    id, nome, sobrenome, cpf, cpf_hash, rg, telefone, telefone_pais,
    email, email_hash, senha_hash, salt, nome_mae, nome_pai,
    sexo, nacionalidade, naturalidade, estado_civil,
    profissao, empresa, cargo,
    ativo, data_criacao, ultima_atualizacao, criado_por, atualizado_por
)
SELECT 
    id,
    COALESCE(nome, ''),
    COALESCE(sobrenome, ''),
    COALESCE(cpf, '000.000.000-00'),
    COALESCE(SHA2(cpf, 256), SHA2('000.000.000-00', 256)),
    rg,
    telefone,
    '+55',
    email,
    COALESCE(SHA2(email, 256), SHA2(CONCAT('user', id, '@temp.com'), 256)),
    COALESCE(senha, '$2a$10$N9qo8uLOickgx2ZMRZoMye7J9K2B9qJz7g0r7i0bFBqQz0B0K0K0K'),
    COALESCE(MD5(CONCAT(id, cpf, NOW())), 'default_salt'),
    nome_mae,
    nome_pai,
    sexo,
    CASE 
        WHEN nacionalidade LIKE 'Brasil%' THEN 'BR'
        WHEN nacionalidade LIKE 'Portug%' THEN 'PT'
        WHEN LENGTH(nacionalidade) = 2 THEN nacionalidade
        ELSE 'BR'
    END,
    naturalidade,
    estado_civil,
    profissao,
    empresa,
    cargo,
    COALESCE(ativo, 1),
    COALESCE(data_criacao, NOW()),
    COALESCE(ultima_atualizacao, NOW()),
    criado_por,
    atualizado_por
FROM usuarios_backup;

-- Substituir tabela antiga pela nova
DROP TABLE usuarios;
RENAME TABLE usuarios_new TO usuarios;

-- ================================================
-- 2. VERIFICAR E CRIAR OUTRAS TABELAS
-- ================================================

-- Tabela refresh_tokens (já deve existir)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    usuario_id BIGINT NOT NULL,
    data_expiracao DATETIME NOT NULL,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revogado BOOLEAN DEFAULT FALSE,
    ip_criacao VARCHAR(45),
    user_agent VARCHAR(255),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_expiracao (data_expiracao),
    INDEX idx_revogado (revogado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela contas
CREATE TABLE IF NOT EXISTS contas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    banco VARCHAR(50) NOT NULL,
    agencia VARCHAR(10) NOT NULL,
    numero_conta VARCHAR(20) NOT NULL,
    digito_verificador VARCHAR(2) NOT NULL,
    iban VARCHAR(34),
    swift_bic VARCHAR(11),
    tipo_conta VARCHAR(20),
    titular VARCHAR(100) NOT NULL,
    cpf_titular VARCHAR(14) NOT NULL,
    
    -- Saldos em múltiplas moedas
    saldo_brl DECIMAL(15,2) DEFAULT 0.00,
    saldo_eur DECIMAL(15,2) DEFAULT 0.00,
    saldo_usd DECIMAL(15,2) DEFAULT 0.00,
    moeda_principal VARCHAR(3) DEFAULT 'BRL',
    
    -- Limites
    limite_credito DECIMAL(15,2) DEFAULT 0.00,
    limite_pix_diario DECIMAL(15,2) DEFAULT 5000.00,
    limite_transferencia_diario DECIMAL(15,2) DEFAULT 10000.00,
    limite_internacional_diario DECIMAL(15,2) DEFAULT 3000.00,
    
    -- Status
    status VARCHAR(20) DEFAULT 'ATIVA',
    ativa BOOLEAN DEFAULT TRUE,
    data_abertura DATE,
    data_encerramento DATE,
    
    -- Auditoria
    data_criacao DATETIME NOT NULL,
    ultima_atualizacao DATETIME NOT NULL,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_banco (banco),
    INDEX idx_status (status),
    INDEX idx_ativa (ativa),
    UNIQUE KEY uk_conta (banco, agencia, numero_conta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela transacoes
CREATE TABLE IF NOT EXISTS transacoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conta_origem_id BIGINT,
    conta_destino_id BIGINT,
    tipo_transacao VARCHAR(30) NOT NULL,
    
    -- Valores
    valor DECIMAL(15,2) NOT NULL,
    moeda VARCHAR(3) DEFAULT 'BRL',
    taxa_cambio DECIMAL(10,6) DEFAULT 1.000000,
    valor_convertido DECIMAL(15,2),
    moeda_destino VARCHAR(3),
    tarifa DECIMAL(10,2) DEFAULT 0.00,
    taxa_iof DECIMAL(10,2) DEFAULT 0.00,
    
    -- Saldos antes/depois
    saldo_anterior_origem DECIMAL(15,2),
    saldo_posterior_origem DECIMAL(15,2),
    saldo_anterior_destino DECIMAL(15,2),
    saldo_posterior_destino DECIMAL(15,2),
    
    -- Detalhes
    descricao TEXT,
    chave_pix VARCHAR(100),
    codigo_autorizacao VARCHAR(50),
    codigo_barras VARCHAR(100),
    qr_code TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'PENDENTE',
    data_transacao DATETIME NOT NULL,
    data_processamento DATETIME,
    data_liquidacao DATETIME,
    
    -- Localização
    ip_origem VARCHAR(45),
    pais_origem VARCHAR(2),
    pais_destino VARCHAR(2),
    
    -- Categoria e tags
    categoria VARCHAR(50),
    subcategoria VARCHAR(50),
    tags VARCHAR(255),
    
    -- Auditoria
    data_criacao DATETIME NOT NULL,
    ultima_atualizacao DATETIME NOT NULL,
    
    FOREIGN KEY (conta_origem_id) REFERENCES contas(id) ON DELETE SET NULL,
    FOREIGN KEY (conta_destino_id) REFERENCES contas(id) ON DELETE SET NULL,
    INDEX idx_conta_origem (conta_origem_id),
    INDEX idx_conta_destino (conta_destino_id),
    INDEX idx_tipo_transacao (tipo_transacao),
    INDEX idx_status (status),
    INDEX idx_data_transacao (data_transacao),
    INDEX idx_categoria (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela chaves_pix
CREATE TABLE IF NOT EXISTS chaves_pix (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conta_id BIGINT NOT NULL,
    tipo_chave VARCHAR(20) NOT NULL,
    chave VARCHAR(100) NOT NULL UNIQUE,
    ativa BOOLEAN DEFAULT TRUE,
    data_criacao DATETIME NOT NULL,
    data_inativacao DATETIME,
    FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE,
    INDEX idx_conta_id (conta_id),
    INDEX idx_tipo_chave (tipo_chave),
    INDEX idx_ativa (ativa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela emprestimos
CREATE TABLE IF NOT EXISTS emprestimos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conta_id BIGINT NOT NULL,
    valor_solicitado DECIMAL(15,2) NOT NULL,
    valor_aprovado DECIMAL(15,2),
    taxa_juros DECIMAL(5,2) NOT NULL,
    numero_parcelas INT NOT NULL,
    valor_parcela DECIMAL(15,2),
    valor_total DECIMAL(15,2),
    data_solicitacao DATETIME NOT NULL,
    data_aprovacao DATETIME,
    data_primeiro_vencimento DATE,
    status VARCHAR(20) DEFAULT 'PENDENTE',
    tipo_emprestimo VARCHAR(50),
    finalidade VARCHAR(100),
    FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE,
    INDEX idx_conta_id (conta_id),
    INDEX idx_status (status),
    INDEX idx_data_solicitacao (data_solicitacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela pagamentos
CREATE TABLE IF NOT EXISTS pagamentos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conta_id BIGINT NOT NULL,
    tipo_pagamento VARCHAR(30) NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    descricao TEXT,
    codigo_barras VARCHAR(100),
    data_vencimento DATE,
    data_pagamento DATETIME,
    status VARCHAR(20) DEFAULT 'PENDENTE',
    FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE,
    INDEX idx_conta_id (conta_id),
    INDEX idx_tipo_pagamento (tipo_pagamento),
    INDEX idx_status (status),
    INDEX idx_data_vencimento (data_vencimento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- 3. INSERIR DADOS INICIAIS SE NÃO EXISTIREM
-- ================================================

-- Inserir usuário admin se não existir
INSERT IGNORE INTO usuarios (
    id, nome, sobrenome, cpf, cpf_hash, email, email_hash,
    senha_hash, salt,
    ativo, data_criacao, ultima_atualizacao
) VALUES (
    1,
    'Admin',
    'Sistema',
    '000.000.000-00',
    SHA2('000.000.000-00', 256),
    'admin@ibank.com',
    SHA2('admin@ibank.com', 256),
    '$2a$10$N9qo8uLOickgx2ZMRZoMye7J9K2B9qJz7g0r7i0bFBqQz0B0K0K0K',
    MD5('admin_salt'),
    TRUE,
    NOW(),
    NOW()
);

-- Inserir conta para admin se não existir
INSERT IGNORE INTO contas (
    id, usuario_id, banco, agencia, numero_conta, digito_verificador,
    tipo_conta, titular, cpf_titular, saldo_brl,
    data_criacao, ultima_atualizacao
) VALUES (
    1,
    1,
    'iBank',
    '0001',
    '1000001',
    '00',
    'CORRENTE',
    'Admin Sistema',
    '000.000.000-00',
    10000.00,
    NOW(),
    NOW()
);

-- ================================================
-- 4. VERIFICAÇÃO FINAL
-- ================================================

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Schema sincronizado com sucesso!' AS status;
SELECT COUNT(*) AS total_usuarios FROM usuarios;
SELECT COUNT(*) AS total_contas FROM contas;
SELECT COUNT(*) AS total_transacoes FROM transacoes;

SHOW TABLES;
