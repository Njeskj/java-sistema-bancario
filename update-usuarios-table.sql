-- ================================================
-- Script Simplificado - Adicionar Colunas Faltantes
-- ================================================

USE java;

-- Adicionar colunas faltantes na tabela usuarios
ALTER TABLE usuarios
    MODIFY COLUMN nome VARCHAR(100) NOT NULL,
    MODIFY COLUMN sobrenome VARCHAR(100) NOT NULL,
    ADD COLUMN IF NOT EXISTS cpf_hash VARCHAR(64) UNIQUE AFTER cpf,
    ADD COLUMN IF NOT EXISTS telefone_pais VARCHAR(5) DEFAULT '+55' AFTER telefone,
    ADD COLUMN IF NOT EXISTS email_hash VARCHAR(64) UNIQUE AFTER email,
    ADD COLUMN IF NOT EXISTS senha_hash VARCHAR(255) AFTER email_hash,
    ADD COLUMN IF NOT EXISTS salt VARCHAR(255) AFTER senha_hash,
    ADD COLUMN IF NOT EXISTS data_nascimento DATE AFTER nome_pai,
    MODIFY COLUMN sexo VARCHAR(30),
    ADD COLUMN IF NOT EXISTS renda_mensal DECIMAL(15,2) AFTER profissao,
    ADD COLUMN IF NOT EXISTS endereco_logradouro VARCHAR(255) AFTER cargo,
    ADD COLUMN IF NOT EXISTS endereco_numero VARCHAR(20) AFTER endereco_logradouro,
    ADD COLUMN IF NOT EXISTS endereco_complemento VARCHAR(100) AFTER endereco_numero,
    ADD COLUMN IF NOT EXISTS endereco_bairro VARCHAR(100) AFTER endereco_complemento,
    ADD COLUMN IF NOT EXISTS endereco_cidade VARCHAR(100) AFTER endereco_bairro,
    ADD COLUMN IF NOT EXISTS endereco_estado VARCHAR(2) AFTER endereco_cidade,
    ADD COLUMN IF NOT EXISTS endereco_cep VARCHAR(10) AFTER endereco_estado,
    ADD COLUMN IF NOT EXISTS endereco_pais VARCHAR(2) DEFAULT 'BR' AFTER endereco_cep,
    ADD COLUMN IF NOT EXISTS dois_fatores_ativo BOOLEAN DEFAULT FALSE AFTER endereco_pais,
    ADD COLUMN IF NOT EXISTS dois_fatores_secret VARCHAR(255) AFTER dois_fatores_ativo,
    ADD COLUMN IF NOT EXISTS tentativas_login_falhas INT DEFAULT 0 AFTER dois_fatores_secret,
    ADD COLUMN IF NOT EXISTS conta_bloqueada BOOLEAN DEFAULT FALSE AFTER tentativas_login_falhas,
    ADD COLUMN IF NOT EXISTS data_ultimo_login DATETIME AFTER conta_bloqueada,
    ADD COLUMN IF NOT EXISTS ip_ultimo_login VARCHAR(45) AFTER data_ultimo_login,
    ADD COLUMN IF NOT EXISTS idioma VARCHAR(5) DEFAULT 'pt-BR' AFTER ip_ultimo_login,
    ADD COLUMN IF NOT EXISTS moeda_preferencial VARCHAR(3) DEFAULT 'BRL' AFTER idioma;

-- Remover colunas obsoletas se existirem
ALTER TABLE usuarios
    DROP COLUMN IF EXISTS escolaridade,
    DROP COLUMN IF EXISTS ano_nascimento,
    DROP COLUMN IF EXISTS idade,
    DROP COLUMN IF EXISTS departamento,
    DROP COLUMN IF EXISTS endereco;

-- Atualizar valores nulos e gerar hashes
UPDATE usuarios 
SET 
    cpf_hash = SHA2(cpf, 256)
WHERE cpf_hash IS NULL OR cpf_hash = '';

UPDATE usuarios 
SET 
    email_hash = SHA2(email, 256)
WHERE email_hash IS NULL OR email_hash = '';

UPDATE usuarios 
SET 
    senha_hash = senha
WHERE senha_hash IS NULL OR senha_hash = '';

UPDATE usuarios 
SET 
    salt = MD5(CONCAT(id, cpf, NOW()))
WHERE salt IS NULL OR salt = '';

-- Atualizar nacionalidade para código de 2 letras
UPDATE usuarios 
SET nacionalidade = CASE 
    WHEN nacionalidade LIKE 'Brasil%' THEN 'BR'
    WHEN nacionalidade LIKE 'Portug%' THEN 'PT'
    WHEN LENGTH(nacionalidade) = 2 THEN nacionalidade
    ELSE 'BR'
END
WHERE LENGTH(nacionalidade) > 2;

-- Adicionar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_email_hash ON usuarios(email_hash);
CREATE INDEX IF NOT EXISTS idx_cpf_hash ON usuarios(cpf_hash);

-- Verificação
SELECT 'Tabela usuarios atualizada com sucesso!' AS status;
DESCRIBE usuarios;
