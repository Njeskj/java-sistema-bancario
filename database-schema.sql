-- =====================================================
-- SCHEMA COMPLETO DO SISTEMA BANCÁRIO IBANK
-- Database: java
-- =====================================================

-- Remover tabelas existentes (cuidado: isso apaga todos os dados!)
-- DROP TABLE IF EXISTS notificacoes;
-- DROP TABLE IF EXISTS metas_financeiras;
-- DROP TABLE IF EXISTS cashback;
-- DROP TABLE IF EXISTS categorias_gasto;
-- DROP TABLE IF EXISTS cartoes;
-- DROP TABLE IF EXISTS chaves_pix;
-- DROP TABLE IF EXISTS investimentos;
-- DROP TABLE IF EXISTS transacoes;
-- DROP TABLE IF EXISTS contas;
-- DROP TABLE IF EXISTS usuarios;

-- =====================================================
-- TABELA: usuarios
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    cpf_hash VARCHAR(64) NOT NULL UNIQUE,
    rg VARCHAR(20),
    telefone VARCHAR(20),
    telefone_pais VARCHAR(5) DEFAULT '+55',
    email VARCHAR(255) UNIQUE,
    email_hash VARCHAR(64) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    nome_mae VARCHAR(255),
    nome_pai VARCHAR(255),
    data_nascimento DATE,
    sexo ENUM('MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO'),
    nacionalidade VARCHAR(2) DEFAULT 'BR',
    naturalidade VARCHAR(100),
    estado_civil ENUM('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL'),
    profissao VARCHAR(100),
    renda_mensal DECIMAL(15,2),
    empresa VARCHAR(150),
    cargo VARCHAR(100),
    endereco_logradouro VARCHAR(255),
    endereco_numero VARCHAR(20),
    endereco_complemento VARCHAR(100),
    endereco_bairro VARCHAR(100),
    endereco_cidade VARCHAR(100),
    endereco_estado VARCHAR(2),
    endereco_cep VARCHAR(10),
    endereco_pais VARCHAR(2) DEFAULT 'BR',
    documento_identidade_url VARCHAR(500),
    comprovante_residencia_url VARCHAR(500),
    selfie_url VARCHAR(500),
    status_verificacao ENUM('PENDENTE', 'EM_ANALISE', 'VERIFICADO', 'REJEITADO') DEFAULT 'PENDENTE',
    motivo_rejeicao TEXT,
    moeda_preferencial VARCHAR(3) DEFAULT 'BRL',
    idioma VARCHAR(5) DEFAULT 'pt-BR',
    tema VARCHAR(20) DEFAULT 'light',
    notificacoes_push BOOLEAN DEFAULT TRUE,
    notificacoes_email BOOLEAN DEFAULT TRUE,
    notificacoes_sms BOOLEAN DEFAULT FALSE,
    tentativas_login INT DEFAULT 0,
    bloqueado_ate DATETIME,
    ultimo_login DATETIME,
    ultimo_ip VARCHAR(45),
    autenticacao_2fa BOOLEAN DEFAULT FALSE,
    chave_2fa VARCHAR(100),
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    data_exclusao DATETIME,
    INDEX idx_cpf (cpf),
    INDEX idx_email (email),
    INDEX idx_status (status_verificacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: contas
-- =====================================================
CREATE TABLE IF NOT EXISTS contas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    banco VARCHAR(50) NOT NULL DEFAULT 'IBank Internacional',
    agencia VARCHAR(10) NOT NULL,
    numero_conta VARCHAR(20) NOT NULL,
    digito_verificador VARCHAR(2) NOT NULL,
    iban VARCHAR(34),
    swift_bic VARCHAR(11),
    tipo_conta ENUM('CORRENTE', 'POUPANCA', 'INVESTIMENTO', 'PAGAMENTO', 'SALARIO') DEFAULT 'CORRENTE',
    titular VARCHAR(255) NOT NULL,
    cpf_titular VARCHAR(14) NOT NULL,
    saldo_brl DECIMAL(15,2) DEFAULT 0.00,
    saldo_eur DECIMAL(15,2) DEFAULT 0.00,
    saldo_usd DECIMAL(15,2) DEFAULT 0.00,
    moeda_principal VARCHAR(3) DEFAULT 'BRL',
    limite_credito DECIMAL(15,2) DEFAULT 0.00,
    limite_pix_diario DECIMAL(15,2) DEFAULT 5000.00,
    limite_transferencia_diario DECIMAL(15,2) DEFAULT 10000.00,
    limite_internacional_diario DECIMAL(15,2) DEFAULT 3000.00,
    limite_saque_diario DECIMAL(15,2) DEFAULT 2000.00,
    codigo_seguranca_hash VARCHAR(255) NOT NULL,
    requer_2fa_transacoes BOOLEAN DEFAULT FALSE,
    biometria_ativa BOOLEAN DEFAULT FALSE,
    status_conta ENUM('ATIVA', 'INATIVA', 'BLOQUEADA', 'CANCELADA') DEFAULT 'ATIVA',
    pais_origem VARCHAR(2) NOT NULL,
    permite_internacional BOOLEAN DEFAULT FALSE,
    data_abertura DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_encerramento DATETIME,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_conta (banco, agencia, numero_conta, digito_verificador),
    INDEX idx_usuario (usuario_id),
    INDEX idx_status (status_conta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: transacoes
-- =====================================================
CREATE TABLE IF NOT EXISTS transacoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conta_origem_id BIGINT,
    conta_destino_id BIGINT,
    tipo_transacao ENUM('PIX', 'TED', 'DOC', 'TRANSFERENCIA_INTERNA', 'DEPOSITO', 'SAQUE', 'PAGAMENTO', 'INTERNACIONAL', 'CASHBACK', 'INVESTIMENTO', 'RESGATE') NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    moeda VARCHAR(3) DEFAULT 'BRL',
    taxa_cambio DECIMAL(10,6) DEFAULT 1.000000,
    valor_convertido DECIMAL(15,2),
    moeda_destino VARCHAR(3),
    tarifa DECIMAL(10,2) DEFAULT 0.00,
    taxa_iof DECIMAL(10,2) DEFAULT 0.00,
    saldo_anterior_origem DECIMAL(15,2),
    saldo_posterior_origem DECIMAL(15,2),
    saldo_anterior_destino DECIMAL(15,2),
    saldo_posterior_destino DECIMAL(15,2),
    descricao TEXT,
    chave_pix VARCHAR(100),
    codigo_autorizacao VARCHAR(50),
    id_transacao_externa VARCHAR(100),
    swift_reference VARCHAR(35),
    iban_destino VARCHAR(34),
    banco_destino VARCHAR(100),
    pais_destino VARCHAR(2),
    status ENUM('PENDENTE', 'PROCESSANDO', 'CONCLUIDA', 'CANCELADA', 'FALHOU', 'ESTORNADA') DEFAULT 'PENDENTE',
    motivo_falha TEXT,
    ip_origem VARCHAR(45),
    device_id VARCHAR(100),
    geolocalizacao_lat DECIMAL(10,8),
    geolocalizacao_lng DECIMAL(11,8),
    comprovante_url VARCHAR(500),
    data_agendamento DATETIME,
    data_processamento DATETIME,
    data_conclusao DATETIME,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conta_origem_id) REFERENCES contas(id) ON DELETE SET NULL,
    FOREIGN KEY (conta_destino_id) REFERENCES contas(id) ON DELETE SET NULL,
    INDEX idx_conta_origem (conta_origem_id),
    INDEX idx_conta_destino (conta_destino_id),
    INDEX idx_tipo (tipo_transacao),
    INDEX idx_status (status),
    INDEX idx_data (data_criacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: chaves_pix
-- =====================================================
CREATE TABLE IF NOT EXISTS chaves_pix (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conta_id BIGINT NOT NULL,
    tipo_chave ENUM('CPF', 'CNPJ', 'EMAIL', 'TELEFONE', 'ALEATORIA') NOT NULL,
    chave VARCHAR(100) NOT NULL UNIQUE,
    chave_hash VARCHAR(64) NOT NULL UNIQUE,
    principal BOOLEAN DEFAULT FALSE,
    status ENUM('ATIVA', 'INATIVA', 'PORTABILIDADE_PENDENTE', 'PORTABILIDADE_CANCELADA') DEFAULT 'ATIVA',
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_exclusao DATETIME,
    FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE,
    INDEX idx_conta (conta_id),
    INDEX idx_tipo (tipo_chave)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: cartoes
-- =====================================================
CREATE TABLE IF NOT EXISTS cartoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conta_id BIGINT NOT NULL,
    tipo_cartao ENUM('DEBITO', 'CREDITO', 'DEBITO_CREDITO', 'VIRTUAL', 'PREPAGO') NOT NULL,
    numero_cartao_hash VARCHAR(64) NOT NULL UNIQUE,
    numero_cartao_criptografado VARCHAR(255) NOT NULL,
    nome_titular VARCHAR(100) NOT NULL,
    validade_mes INT NOT NULL,
    validade_ano INT NOT NULL,
    cvv_hash VARCHAR(64) NOT NULL,
    bandeira ENUM('VISA', 'MASTERCARD', 'ELO', 'AMERICAN_EXPRESS', 'HIPERCARD') NOT NULL,
    limite_total DECIMAL(15,2) DEFAULT 0.00,
    limite_disponivel DECIMAL(15,2) DEFAULT 0.00,
    limite_internacional DECIMAL(15,2) DEFAULT 0.00,
    senha_hash VARCHAR(255),
    bloqueado BOOLEAN DEFAULT FALSE,
    ativo_compras_online BOOLEAN DEFAULT TRUE,
    ativo_compras_internacional BOOLEAN DEFAULT FALSE,
    ativo_contactless BOOLEAN DEFAULT TRUE,
    motivo_bloqueio VARCHAR(255),
    status ENUM('ATIVO', 'BLOQUEADO', 'CANCELADO', 'VENCIDO') DEFAULT 'ATIVO',
    data_emissao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_bloqueio DATETIME,
    data_cancelamento DATETIME,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE,
    INDEX idx_conta (conta_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: investimentos
-- =====================================================
CREATE TABLE IF NOT EXISTS investimentos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conta_id BIGINT NOT NULL,
    tipo_investimento ENUM('CDB', 'TESOURO_DIRETO', 'ACOES', 'FUNDOS_IMOBILIARIOS', 'FUNDOS_INVESTIMENTO', 'LCI', 'LCA', 'PREVIDENCIA', 'CRIPTOMOEDAS') NOT NULL,
    nome_produto VARCHAR(255) NOT NULL,
    codigo_produto VARCHAR(50),
    valor_aplicado DECIMAL(15,2) NOT NULL,
    valor_atual DECIMAL(15,2) NOT NULL,
    rentabilidade_percentual DECIMAL(10,4),
    data_aplicacao DATE NOT NULL,
    data_vencimento DATE,
    liquidez ENUM('DIARIA', 'SEMANAL', 'MENSAL', 'VENCIMENTO') DEFAULT 'DIARIA',
    risco ENUM('BAIXO', 'MEDIO', 'ALTO', 'MUITO_ALTO') DEFAULT 'MEDIO',
    emissor VARCHAR(255),
    custodiante VARCHAR(255),
    status ENUM('ATIVO', 'RESGATADO', 'VENCIDO', 'CANCELADO') DEFAULT 'ATIVO',
    data_resgate DATETIME,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE,
    INDEX idx_conta (conta_id),
    INDEX idx_tipo (tipo_investimento),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: categorias_gasto
-- =====================================================
CREATE TABLE IF NOT EXISTS categorias_gasto (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    icone VARCHAR(50),
    cor VARCHAR(7),
    limite_mensal DECIMAL(15,2),
    tipo ENUM('ESSENCIAL', 'NAO_ESSENCIAL', 'INVESTIMENTO', 'POUPANCA', 'OUTRO') DEFAULT 'OUTRO',
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: metas_financeiras
-- =====================================================
CREATE TABLE IF NOT EXISTS metas_financeiras (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    valor_alvo DECIMAL(15,2) NOT NULL,
    valor_acumulado DECIMAL(15,2) DEFAULT 0.00,
    data_inicio DATE NOT NULL,
    data_alvo DATE NOT NULL,
    status ENUM('EM_PROGRESSO', 'CONCLUIDA', 'CANCELADA', 'ATRASADA') DEFAULT 'EM_PROGRESSO',
    prioridade ENUM('BAIXA', 'MEDIA', 'ALTA') DEFAULT 'MEDIA',
    data_conclusao DATE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: cashback
-- =====================================================
CREATE TABLE IF NOT EXISTS cashback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conta_id BIGINT NOT NULL,
    transacao_id BIGINT,
    valor_cashback DECIMAL(10,2) NOT NULL,
    percentual DECIMAL(5,2),
    categoria VARCHAR(100),
    estabelecimento VARCHAR(255),
    status ENUM('PENDENTE', 'APROVADO', 'CREDITADO', 'CANCELADO') DEFAULT 'PENDENTE',
    data_aprovacao DATETIME,
    data_credito DATETIME,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE,
    FOREIGN KEY (transacao_id) REFERENCES transacoes(id) ON DELETE SET NULL,
    INDEX idx_conta (conta_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: notificacoes
-- =====================================================
CREATE TABLE IF NOT EXISTS notificacoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo ENUM('TRANSACAO', 'SEGURANCA', 'LIMITE', 'PROMOCAO', 'SISTEMA', 'ALERTA') NOT NULL,
    prioridade ENUM('BAIXA', 'MEDIA', 'ALTA', 'URGENTE') DEFAULT 'MEDIA',
    lida BOOLEAN DEFAULT FALSE,
    data_leitura DATETIME,
    link_acao VARCHAR(500),
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_lida (lida),
    INDEX idx_data (data_criacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- DADOS INICIAIS (OPCIONAL)
-- =====================================================

-- Inserir usuário de teste (senha: 123456)
INSERT INTO usuarios (nome, sobrenome, cpf, cpf_hash, email, email_hash, senha_hash, salt, nacionalidade, idioma) 
VALUES (
    'Israel', 
    'Silva', 
    '000.000.000-00',
    SHA2('000.000.000-00', 256),
    'israel@ibank.com',
    SHA2('israel@ibank.com', 256),
    SHA2(CONCAT('123456', 'salt123'), 256),
    'salt123',
    'BR',
    'pt-BR'
) ON DUPLICATE KEY UPDATE id=id;

-- Inserir conta de teste
INSERT INTO contas (usuario_id, banco, agencia, numero_conta, digito_verificador, titular, cpf_titular, saldo_brl, codigo_seguranca_hash, pais_origem)
SELECT 
    u.id,
    'IBank Internacional',
    '0001',
    '123456',
    '7',
    'Israel Silva',
    '000.000.000-00',
    15430.50,
    SHA2('1234', 256),
    'BR'
FROM usuarios u WHERE u.cpf = '000.000.000-00'
ON DUPLICATE KEY UPDATE id=id;

-- =====================================================
-- VERIFICAÇÃO DO SCHEMA
-- =====================================================
-- Execute esta query para verificar todas as tabelas criadas:
-- SHOW TABLES;
-- 
-- Para ver a estrutura de uma tabela específica:
-- DESCRIBE usuarios;
-- DESCRIBE contas;
-- DESCRIBE transacoes;
