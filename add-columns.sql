-- ================================================
-- Script de Atualização da Tabela Usuarios
-- ================================================

USE java;

-- Passo 1: Adicionar colunas que certamente não existem
ALTER TABLE usuarios
    ADD COLUMN cpf_hash VARCHAR(64) AFTER cpf,
    ADD COLUMN telefone_pais VARCHAR(5) DEFAULT '+55' AFTER telefone,
    ADD COLUMN email_hash VARCHAR(64) AFTER email,
    ADD COLUMN senha_hash VARCHAR(255) AFTER email_hash,
    ADD COLUMN salt VARCHAR(255) AFTER senha_hash,
    ADD COLUMN data_nascimento DATE AFTER nome_pai,
    ADD COLUMN renda_mensal DECIMAL(15,2) AFTER profissao,
    ADD COLUMN endereco_logradouro VARCHAR(255) AFTER cargo,
    ADD COLUMN endereco_numero VARCHAR(20) AFTER endereco_logradouro,
    ADD COLUMN endereco_complemento VARCHAR(100) AFTER endereco_numero,
    ADD COLUMN endereco_bairro VARCHAR(100) AFTER endereco_complemento,
    ADD COLUMN endereco_cidade VARCHAR(100) AFTER endereco_bairro,
    ADD COLUMN endereco_estado VARCHAR(2) AFTER endereco_cidade,
    ADD COLUMN endereco_cep VARCHAR(10) AFTER endereco_estado,
    ADD COLUMN endereco_pais VARCHAR(2) DEFAULT 'BR' AFTER endereco_cep,
    ADD COLUMN dois_fatores_ativo BOOLEAN DEFAULT FALSE AFTER endereco_pais,
    ADD COLUMN dois_fatores_secret VARCHAR(255) AFTER dois_fatores_ativo,
    ADD COLUMN tentativas_login_falhas INT DEFAULT 0 AFTER dois_fatores_secret,
    ADD COLUMN conta_bloqueada BOOLEAN DEFAULT FALSE AFTER tentativas_login_falhas,
    ADD COLUMN data_ultimo_login DATETIME AFTER conta_bloqueada,
    ADD COLUMN ip_ultimo_login VARCHAR(45) AFTER data_ultimo_login,
    ADD COLUMN idioma VARCHAR(5) DEFAULT 'pt-BR' AFTER ip_ultimo_login,
    ADD COLUMN moeda_preferencial VARCHAR(3) DEFAULT 'BRL' AFTER idioma;
