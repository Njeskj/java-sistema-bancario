-- ========================================
-- IBank - Sistema Bancário Internacional
-- Database Schema v2.0 - Com Segurança Aprimorada
-- ========================================

CREATE DATABASE IF NOT EXISTS java CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE java;

-- ========================================
-- Tabela: usuarios (com criptografia)
-- ========================================
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    cpf VARCHAR(255) NOT NULL UNIQUE COMMENT 'CPF criptografado com AES-256',
    cpf_hash VARCHAR(64) NOT NULL UNIQUE COMMENT 'Hash SHA-256 do CPF para buscas',
    rg VARCHAR(255) COMMENT 'RG criptografado',
    telefone VARCHAR(255) COMMENT 'Telefone criptografado',
    telefone_pais VARCHAR(5) DEFAULT '+55' COMMENT 'Código do país (+55 BR, +351 PT)',
    email VARCHAR(255) UNIQUE COMMENT 'Email criptografado',
    email_hash VARCHAR(64) NOT NULL UNIQUE COMMENT 'Hash SHA-256 do email para buscas',
    senha_hash VARCHAR(255) NOT NULL COMMENT 'Senha com BCrypt',
    salt VARCHAR(255) NOT NULL COMMENT 'Salt único para criptografia adicional',
    
    -- Dados pessoais criptografados
    nome_mae VARCHAR(255),
    nome_pai VARCHAR(255),
    data_nascimento DATE,
    sexo ENUM('M', 'F', 'Outro', 'Prefiro não informar'),
    nacionalidade VARCHAR(2) DEFAULT 'BR' COMMENT 'ISO 3166-1 alpha-2 (BR, PT)',
    naturalidade VARCHAR(100),
    estado_civil ENUM('Solteiro', 'Casado', 'Divorciado', 'Viúvo', 'União Estável'),
    
    -- Dados profissionais
    profissao VARCHAR(100),
    renda_mensal DECIMAL(15, 2),
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
    
    -- Segurança e controle
    dois_fatores_ativo BOOLEAN DEFAULT FALSE,
    dois_fatores_secret VARCHAR(255),
    tentativas_login_falhas INT DEFAULT 0,
    conta_bloqueada BOOLEAN DEFAULT FALSE,
    data_ultimo_login TIMESTAMP NULL,
    ip_ultimo_login VARCHAR(45),
    
    -- Preferências
    idioma VARCHAR(5) DEFAULT 'pt-BR' COMMENT 'pt-BR, pt-PT',
    moeda_preferencial VARCHAR(3) DEFAULT 'BRL' COMMENT 'ISO 4217 (BRL, EUR)',
    
    -- Auditoria
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    criado_por VARCHAR(100),
    atualizado_por VARCHAR(100),
    
    INDEX idx_cpf_hash (cpf_hash),
    INDEX idx_email_hash (email_hash),
    INDEX idx_nacionalidade (nacionalidade),
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB;

-- ========================================
-- Tabela: sessoes (controle de sessões JWT)
-- ========================================
CREATE TABLE IF NOT EXISTS sessoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    token_jti VARCHAR(255) NOT NULL UNIQUE COMMENT 'JWT ID único',
    token_hash VARCHAR(64) NOT NULL COMMENT 'Hash do token para revogação',
    ip_address VARCHAR(45),
    user_agent TEXT,
    dispositivo_tipo ENUM('Web', 'Mobile', 'Tablet', 'Desktop', 'API') DEFAULT 'Web',
    dispositivo_id VARCHAR(255) COMMENT 'Device fingerprint',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_expiracao TIMESTAMP NOT NULL,
    revogado BOOLEAN DEFAULT FALSE,
    data_revogacao TIMESTAMP NULL,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_token_jti (token_jti),
    INDEX idx_expiracao (data_expiracao),
    INDEX idx_revogado (revogado)
) ENGINE=InnoDB;

-- ========================================
-- Tabela: contas (com segurança aprimorada)
-- ========================================
CREATE TABLE IF NOT EXISTS contas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    
    -- Identificação da conta
    banco VARCHAR(50) NOT NULL DEFAULT 'IBank',
    agencia VARCHAR(10) NOT NULL,
    numero_conta VARCHAR(20) NOT NULL,
    digito_verificador VARCHAR(2) NOT NULL,
    iban VARCHAR(34) COMMENT 'IBAN para contas PT',
    swift_bic VARCHAR(11) COMMENT 'SWIFT/BIC code',
    
    -- Tipo e titular
    tipo_conta ENUM('Corrente', 'Poupança', 'Salário', 'Investimento', 'Universitária') DEFAULT 'Corrente',
    titular VARCHAR(255) NOT NULL,
    cpf_titular VARCHAR(255) NOT NULL COMMENT 'Criptografado',
    
    -- Saldos multi-moeda
    saldo_brl DECIMAL(15, 2) DEFAULT 0.00,
    saldo_eur DECIMAL(15, 2) DEFAULT 0.00,
    saldo_usd DECIMAL(15, 2) DEFAULT 0.00,
    moeda_principal VARCHAR(3) DEFAULT 'BRL',
    
    -- Limites
    limite_credito DECIMAL(15, 2) DEFAULT 0.00,
    limite_pix_diario DECIMAL(15, 2) DEFAULT 5000.00,
    limite_transferencia_diario DECIMAL(15, 2) DEFAULT 10000.00,
    limite_internacional_diario DECIMAL(15, 2) DEFAULT 3000.00,
    limite_saque_diario DECIMAL(15, 2) DEFAULT 2000.00,
    
    -- Segurança
    codigo_seguranca_hash VARCHAR(255) NOT NULL COMMENT 'Hash do código de segurança',
    requer_2fa_transacoes BOOLEAN DEFAULT FALSE,
    biometria_ativa BOOLEAN DEFAULT FALSE,
    
    -- Status e controle
    status_conta ENUM('Ativa', 'Bloqueada', 'Inativa', 'Encerrada') DEFAULT 'Ativa',
    pais_origem VARCHAR(2) NOT NULL COMMENT 'BR ou PT',
    permite_internacional BOOLEAN DEFAULT FALSE,
    
    -- Auditoria
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    data_ultimo_acesso TIMESTAMP NULL,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY uk_conta (agencia, numero_conta, digito_verificador),
    INDEX idx_usuario (usuario_id),
    INDEX idx_status (status_conta),
    INDEX idx_pais (pais_origem)
) ENGINE=InnoDB;

-- ========================================
-- Tabela: cartoes
-- ========================================
CREATE TABLE IF NOT EXISTS cartoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conta_id BIGINT NOT NULL,
    
    -- Dados do cartão (criptografados)
    numero_cartao VARCHAR(255) NOT NULL UNIQUE COMMENT 'Número criptografado',
    numero_hash VARCHAR(64) NOT NULL UNIQUE COMMENT 'Hash para buscas',
    cvv_hash VARCHAR(255) NOT NULL COMMENT 'CVV criptografado',
    nome_impresso VARCHAR(100) NOT NULL,
    
    -- Tipo e bandeira
    tipo_cartao ENUM('Débito', 'Crédito', 'Débito/Crédito', 'Virtual', 'Pré-pago') NOT NULL,
    bandeira ENUM('Visa', 'Mastercard', 'Elo', 'American Express', 'Hipercard') NOT NULL,
    
    -- Validade e limites
    data_validade DATE NOT NULL,
    limite_credito DECIMAL(15, 2) DEFAULT 0.00,
    saldo_utilizado DECIMAL(15, 2) DEFAULT 0.00,
    limite_diario DECIMAL(15, 2) DEFAULT 3000.00,
    limite_internacional DECIMAL(15, 2) DEFAULT 5000.00,
    
    -- Segurança
    bloqueado BOOLEAN DEFAULT FALSE,
    motivo_bloqueio VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    permite_compras_online BOOLEAN DEFAULT TRUE,
    permite_compras_internacional BOOLEAN DEFAULT TRUE,
    permite_contactless BOOLEAN DEFAULT TRUE,
    
    -- Controle
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_desbloqueio TIMESTAMP NULL,
    ultima_utilizacao TIMESTAMP NULL,
    
    FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE,
    INDEX idx_conta (conta_id),
    INDEX idx_ativo (ativo),
    INDEX idx_tipo (tipo_cartao)
) ENGINE=InnoDB;

-- ========================================
-- Tabela: transacoes (aprimorada)
-- ========================================
CREATE TABLE IF NOT EXISTS transacoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Contas envolvidas
    conta_origem_id BIGINT,
    conta_destino_id BIGINT,
    
    -- Dados da transação
    tipo_transacao ENUM('Depósito', 'Saque', 'Transferência', 'PIX', 'TED', 'DOC', 'Pagamento', 
                        'Compra Débito', 'Compra Crédito', 'Transferência Internacional', 
                        'Câmbio', 'Empréstimo', 'Investimento', 'Resgate', 'Rendimento') NOT NULL,
    
    -- Valores
    valor DECIMAL(15, 2) NOT NULL,
    moeda VARCHAR(3) DEFAULT 'BRL',
    taxa_cambio DECIMAL(10, 6) DEFAULT 1.000000,
    valor_convertido DECIMAL(15, 2),
    moeda_destino VARCHAR(3),
    
    -- Taxas e tarifas
    tarifa DECIMAL(10, 2) DEFAULT 0.00,
    taxa_iof DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Saldos (auditoria)
    saldo_anterior_origem DECIMAL(15, 2),
    saldo_posterior_origem DECIMAL(15, 2),
    saldo_anterior_destino DECIMAL(15, 2),
    saldo_posterior_destino DECIMAL(15, 2),
    
    -- Detalhes
    descricao TEXT,
    chave_pix VARCHAR(100),
    codigo_autorizacao VARCHAR(50),
    id_transacao_externa VARCHAR(100) COMMENT 'ID da transação em sistemas externos',
    
    -- Internacional
    swift_reference VARCHAR(35) COMMENT 'SWIFT MT103 Reference',
    iban_destino VARCHAR(34),
    banco_destino VARCHAR(100),
    pais_destino VARCHAR(2),
    
    -- Status e controle
    status ENUM('Pendente', 'Processando', 'Concluída', 'Cancelada', 'Falha', 'Agendada', 'Estornada') DEFAULT 'Pendente',
    motivo_falha TEXT,
    ip_origem VARCHAR(45),
    dispositivo VARCHAR(50),
    localizacao VARCHAR(255),
    
    -- Auditoria e segurança
    requer_aprovacao BOOLEAN DEFAULT FALSE,
    aprovada_por BIGINT,
    data_aprovacao TIMESTAMP NULL,
    score_fraude DECIMAL(5, 2) COMMENT 'Score de 0-100 para detecção de fraude',
    
    -- Datas
    data_transacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_processamento TIMESTAMP NULL,
    data_agendamento TIMESTAMP NULL,
    
    FOREIGN KEY (conta_origem_id) REFERENCES contas(id),
    FOREIGN KEY (conta_destino_id) REFERENCES contas(id),
    FOREIGN KEY (aprovada_por) REFERENCES usuarios(id),
    
    INDEX idx_conta_origem (conta_origem_id),
    INDEX idx_conta_destino (conta_destino_id),
    INDEX idx_tipo (tipo_transacao),
    INDEX idx_status (status),
    INDEX idx_data (data_transacao),
    INDEX idx_moeda (moeda),
    INDEX idx_score_fraude (score_fraude)
) ENGINE=InnoDB;

-- ========================================
-- Tabela: chaves_pix (aprimorada)
-- ========================================
CREATE TABLE IF NOT EXISTS chaves_pix (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conta_id BIGINT NOT NULL,
    tipo_chave ENUM('CPF', 'CNPJ', 'Email', 'Telefone', 'Aleatória') NOT NULL,
    chave VARCHAR(255) NOT NULL UNIQUE COMMENT 'Chave criptografada',
    chave_hash VARCHAR(64) NOT NULL UNIQUE COMMENT 'Hash para buscas',
    ativa BOOLEAN DEFAULT TRUE,
    principal BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_inativacao TIMESTAMP NULL,
    
    FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE,
    UNIQUE KEY uk_tipo_conta (tipo_chave, conta_id),
    INDEX idx_conta (conta_id),
    INDEX idx_tipo (tipo_chave),
    INDEX idx_chave_hash (chave_hash),
    INDEX idx_ativa (ativa)
) ENGINE=InnoDB;

-- ========================================
-- Tabela: pagamentos
-- ========================================
CREATE TABLE IF NOT EXISTS pagamentos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conta_id BIGINT NOT NULL,
    transacao_id BIGINT,
    
    tipo_pagamento ENUM('Luz', 'Água', 'Gás', 'Telefone', 'Internet', 'TV', 'Condomínio', 
                        'IPTU', 'IPVA', 'Boleto', 'Fatura Cartão', 'Escola', 'Seguro', 'Outro') NOT NULL,
    
    codigo_barras VARCHAR(255) COMMENT 'Código de barras criptografado',
    linha_digitavel VARCHAR(255),
    valor DECIMAL(15, 2) NOT NULL,
    valor_pago DECIMAL(15, 2),
    juros DECIMAL(10, 2) DEFAULT 0.00,
    multa DECIMAL(10, 2) DEFAULT 0.00,
    desconto DECIMAL(10, 2) DEFAULT 0.00,
    
    favorecido VARCHAR(255),
    descricao TEXT,
    
    data_vencimento DATE NOT NULL,
    data_pagamento TIMESTAMP NULL,
    status ENUM('Pendente', 'Pago', 'Atrasado', 'Cancelado', 'Agendado') DEFAULT 'Pendente',
    
    agendado BOOLEAN DEFAULT FALSE,
    recorrente BOOLEAN DEFAULT FALSE,
    frequencia_recorrencia ENUM('Mensal', 'Bimestral', 'Trimestral', 'Semestral', 'Anual'),
    
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE,
    FOREIGN KEY (transacao_id) REFERENCES transacoes(id),
    INDEX idx_conta (conta_id),
    INDEX idx_status (status),
    INDEX idx_vencimento (data_vencimento),
    INDEX idx_tipo (tipo_pagamento)
) ENGINE=InnoDB;

-- ========================================
-- Tabela: emprestimos
-- ========================================
CREATE TABLE IF NOT EXISTS emprestimos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conta_id BIGINT NOT NULL,
    
    tipo_emprestimo ENUM('Pessoal', 'Consignado', 'Imobiliário', 'Veicular', 
                         'Cheque Especial', 'Rotativo Cartão', 'Crédito Rural') NOT NULL,
    
    valor_solicitado DECIMAL(15, 2) NOT NULL,
    valor_aprovado DECIMAL(15, 2),
    valor_liberado DECIMAL(15, 2),
    moeda VARCHAR(3) DEFAULT 'BRL',
    
    taxa_juros_mensal DECIMAL(8, 4) NOT NULL,
    taxa_juros_anual DECIMAL(8, 4) NOT NULL,
    cet DECIMAL(8, 4) COMMENT 'Custo Efetivo Total',
    
    numero_parcelas INT NOT NULL,
    valor_parcela DECIMAL(15, 2),
    parcelas_pagas INT DEFAULT 0,
    valor_total_pago DECIMAL(15, 2) DEFAULT 0.00,
    
    data_primeiro_vencimento DATE,
    dia_vencimento INT,
    
    status ENUM('Solicitado', 'Em Análise', 'Aprovado', 'Reprovado', 'Liberado', 
                'Em Dia', 'Atrasado', 'Quitado', 'Cancelado') DEFAULT 'Solicitado',
    
    score_credito INT COMMENT 'Score de crédito no momento da solicitação',
    renda_comprovada DECIMAL(15, 2),
    motivo_reprovacao TEXT,
    
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_aprovacao TIMESTAMP NULL,
    data_liberacao TIMESTAMP NULL,
    data_quitacao TIMESTAMP NULL,
    
    FOREIGN KEY (conta_id) REFERENCES contas(id),
    INDEX idx_conta (conta_id),
    INDEX idx_status (status),
    INDEX idx_tipo (tipo_emprestimo)
) ENGINE=InnoDB;

-- ========================================
-- Tabela: parcelas_emprestimo
-- ========================================
CREATE TABLE IF NOT EXISTS parcelas_emprestimo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    emprestimo_id BIGINT NOT NULL,
    transacao_id BIGINT,
    
    numero_parcela INT NOT NULL,
    valor_parcela DECIMAL(15, 2) NOT NULL,
    valor_principal DECIMAL(15, 2) NOT NULL,
    valor_juros DECIMAL(15, 2) NOT NULL,
    valor_pago DECIMAL(15, 2) DEFAULT 0.00,
    
    data_vencimento DATE NOT NULL,
    data_pagamento TIMESTAMP NULL,
    
    status ENUM('Pendente', 'Paga', 'Atrasada', 'Quitada Antecipadamente') DEFAULT 'Pendente',
    dias_atraso INT DEFAULT 0,
    multa DECIMAL(10, 2) DEFAULT 0.00,
    juros_mora DECIMAL(10, 2) DEFAULT 0.00,
    
    FOREIGN KEY (emprestimo_id) REFERENCES emprestimos(id) ON DELETE CASCADE,
    FOREIGN KEY (transacao_id) REFERENCES transacoes(id),
    INDEX idx_emprestimo (emprestimo_id),
    INDEX idx_status (status),
    INDEX idx_vencimento (data_vencimento)
) ENGINE=InnoDB;

-- ========================================
-- Tabela: investimentos
-- ========================================
CREATE TABLE IF NOT EXISTS investimentos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conta_id BIGINT NOT NULL,
    
    tipo_investimento ENUM('Poupança', 'CDB', 'LCI', 'LCA', 'Tesouro Direto', 'Ações', 
                           'Fundos Imobiliários', 'Fundos Multimercado', 'Debêntures', 
                           'COE', 'Previdência Privada', 'Criptomoedas') NOT NULL,
    
    nome_investimento VARCHAR(255) NOT NULL,
    codigo_ativo VARCHAR(20),
    emissor VARCHAR(255),
    
    valor_aplicado DECIMAL(15, 2) NOT NULL,
    valor_atual DECIMAL(15, 2) NOT NULL,
    rentabilidade_percentual DECIMAL(8, 4),
    rentabilidade_bruta DECIMAL(15, 2) DEFAULT 0.00,
    rentabilidade_liquida DECIMAL(15, 2) DEFAULT 0.00,
    
    moeda VARCHAR(3) DEFAULT 'BRL',
    indexador VARCHAR(50) COMMENT 'CDI, IPCA, SELIC, etc',
    taxa_rentabilidade DECIMAL(8, 4),
    
    data_aplicacao DATE NOT NULL,
    data_vencimento DATE,
    data_resgate DATE,
    
    liquidez ENUM('Imediata', 'Diária', 'No Vencimento', 'Carência') NOT NULL,
    dias_carencia INT DEFAULT 0,
    permite_resgate_antecipado BOOLEAN DEFAULT TRUE,
    
    status ENUM('Ativo', 'Resgatado', 'Vencido', 'Cancelado') DEFAULT 'Ativo',
    
    ir_aliquota DECIMAL(5, 2),
    ir_retido DECIMAL(15, 2) DEFAULT 0.00,
    iof_aliquota DECIMAL(5, 2),
    iof_retido DECIMAL(15, 2) DEFAULT 0.00,
    
    risco ENUM('Baixo', 'Médio', 'Alto', 'Muito Alto') DEFAULT 'Médio',
    garantia_fgc BOOLEAN DEFAULT FALSE,
    
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (conta_id) REFERENCES contas(id),
    INDEX idx_conta (conta_id),
    INDEX idx_tipo (tipo_investimento),
    INDEX idx_status (status),
    INDEX idx_vencimento (data_vencimento)
) ENGINE=InnoDB;

-- ========================================
-- Tabela: cotacoes_moedas (cache de câmbio)
-- ========================================
CREATE TABLE IF NOT EXISTS cotacoes_moedas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    moeda_origem VARCHAR(3) NOT NULL,
    moeda_destino VARCHAR(3) NOT NULL,
    taxa_compra DECIMAL(10, 6) NOT NULL,
    taxa_venda DECIMAL(10, 6) NOT NULL,
    taxa_media DECIMAL(10, 6) NOT NULL,
    fonte VARCHAR(50) COMMENT 'Banco Central, API externa, etc',
    data_cotacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valido_ate TIMESTAMP NOT NULL,
    
    UNIQUE KEY uk_moedas_data (moeda_origem, moeda_destino, data_cotacao),
    INDEX idx_moedas (moeda_origem, moeda_destino),
    INDEX idx_validade (valido_ate)
) ENGINE=InnoDB;

-- ========================================
-- Tabela: notificacoes
-- ========================================
CREATE TABLE IF NOT EXISTS notificacoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    
    tipo_notificacao ENUM('Transação', 'Segurança', 'Pagamento', 'Empréstimo', 'Investimento', 
                          'Sistema', 'Marketing', 'Alerta', 'Limite') NOT NULL,
    
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    
    prioridade ENUM('Baixa', 'Normal', 'Alta', 'Urgente') DEFAULT 'Normal',
    
    canal ENUM('App', 'Email', 'SMS', 'Push', 'WhatsApp') NOT NULL,
    enviada BOOLEAN DEFAULT FALSE,
    lida BOOLEAN DEFAULT FALSE,
    
    referencia_tipo VARCHAR(50) COMMENT 'transacao, pagamento, etc',
    referencia_id BIGINT COMMENT 'ID do registro relacionado',
    
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_envio TIMESTAMP NULL,
    data_leitura TIMESTAMP NULL,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_tipo (tipo_notificacao),
    INDEX idx_lida (lida),
    INDEX idx_enviada (enviada)
) ENGINE=InnoDB;

-- ========================================
-- Tabela: auditoria
-- ========================================
CREATE TABLE IF NOT EXISTS auditoria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT,
    
    acao VARCHAR(100) NOT NULL,
    tabela VARCHAR(50) NOT NULL,
    registro_id BIGINT,
    
    dados_anteriores JSON,
    dados_novos JSON,
    
    ip_address VARCHAR(45),
    user_agent TEXT,
    sessao_id BIGINT,
    
    data_acao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (sessao_id) REFERENCES sessoes(id) ON DELETE SET NULL,
    INDEX idx_usuario (usuario_id),
    INDEX idx_tabela (tabela),
    INDEX idx_data (data_acao)
) ENGINE=InnoDB;

-- ========================================
-- Tabela: tentativas_fraude
-- ========================================
CREATE TABLE IF NOT EXISTS tentativas_fraude (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT,
    conta_id BIGINT,
    transacao_id BIGINT,
    
    tipo_alerta ENUM('Login Suspeito', 'Transação Incomum', 'Localização Suspeita', 
                     'Dispositivo Novo', 'Múltiplas Tentativas', 'Valor Alto', 
                     'Padrão Anormal', 'IP Blacklist') NOT NULL,
    
    score_risco DECIMAL(5, 2) NOT NULL COMMENT 'Score de 0-100',
    descricao TEXT,
    
    ip_address VARCHAR(45),
    localizacao VARCHAR(255),
    dispositivo TEXT,
    
    acao_tomada ENUM('Bloqueado', 'Notificado', 'Liberado', 'Aguardando', 'Falso Positivo') DEFAULT 'Aguardando',
    
    data_deteccao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_resolucao TIMESTAMP NULL,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE,
    FOREIGN KEY (transacao_id) REFERENCES transacoes(id) ON DELETE SET NULL,
    INDEX idx_usuario (usuario_id),
    INDEX idx_conta (conta_id),
    INDEX idx_score (score_risco),
    INDEX idx_tipo (tipo_alerta)
) ENGINE=InnoDB;

-- ========================================
-- Tabela: limites_personalizados
-- ========================================
CREATE TABLE IF NOT EXISTS limites_personalizados (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conta_id BIGINT NOT NULL,
    
    tipo_operacao ENUM('PIX', 'Transferência', 'Saque', 'Compra Débito', 'Compra Crédito', 
                       'Internacional', 'Pagamento', 'Todos') NOT NULL,
    
    periodo ENUM('Diário', 'Semanal', 'Mensal', 'Por Transação') NOT NULL,
    
    limite_valor DECIMAL(15, 2) NOT NULL,
    limite_quantidade INT,
    valor_usado DECIMAL(15, 2) DEFAULT 0.00,
    quantidade_usada INT DEFAULT 0,
    
    ativo BOOLEAN DEFAULT TRUE,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    
    ultima_resetagem TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE,
    INDEX idx_conta (conta_id),
    INDEX idx_tipo (tipo_operacao),
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB;

-- ========================================
-- DADOS DE TESTE
-- ========================================

-- Inserir usuário de teste (Brasil)
INSERT INTO usuarios (
    nome, sobrenome, cpf, cpf_hash, email, email_hash, 
    senha_hash, salt, telefone_pais, nacionalidade, idioma, moeda_preferencial,
    data_nascimento, sexo, estado_civil, ativo
) VALUES (
    'Admin', 'Teste', 
    'ENCRYPTED_CPF_00000000000',
    SHA2('00000000000', 256),
    'ENCRYPTED_admin@ibank.com',
    SHA2('admin@ibank.com', 256),
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- senha: 123456
    'SALT_UNICO_USUARIO_1',
    '+55',
    'BR',
    'pt-BR',
    'BRL',
    '1990-01-01',
    'M',
    'Solteiro',
    TRUE
);

-- Inserir usuário de teste (Portugal)
INSERT INTO usuarios (
    nome, sobrenome, cpf, cpf_hash, email, email_hash,
    senha_hash, salt, telefone_pais, nacionalidade, idioma, moeda_preferencial,
    data_nascimento, sexo, estado_civil, ativo
) VALUES (
    'Utilizador', 'Portugal',
    'ENCRYPTED_NIF_111111111',
    SHA2('111111111', 256),
    'ENCRYPTED_user@ibank.pt',
    SHA2('user@ibank.pt', 256),
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- senha: 123456
    'SALT_UNICO_USUARIO_2',
    '+351',
    'PT',
    'pt-PT',
    'EUR',
    '1992-05-15',
    'F',
    'Casado',
    TRUE
);

-- Criar conta brasileira
INSERT INTO contas (
    usuario_id, banco, agencia, numero_conta, digito_verificador,
    tipo_conta, titular, cpf_titular,
    saldo_brl, limite_credito, codigo_seguranca_hash,
    status_conta, pais_origem, permite_internacional, moeda_principal
) VALUES (
    1, 'IBank Brasil', '0001', '0000000', '0',
    'Corrente', 'Admin Teste', 'ENCRYPTED_CPF_00000000000',
    5000.00, 10000.00, SHA2('123456', 256),
    'Ativa', 'BR', TRUE, 'BRL'
);

-- Criar conta portuguesa
INSERT INTO contas (
    usuario_id, banco, agencia, numero_conta, digito_verificador, iban, swift_bic,
    tipo_conta, titular, cpf_titular,
    saldo_eur, limite_credito, codigo_seguranca_hash,
    status_conta, pais_origem, permite_internacional, moeda_principal
) VALUES (
    2, 'IBank Portugal', '0001', '1111111', '1', 'PT50000000001111111111', 'IBANKPTL',
    'Corrente', 'Utilizador Portugal', 'ENCRYPTED_NIF_111111111',
    2000.00, 5000.00, SHA2('654321', 256),
    'Ativa', 'PT', TRUE, 'EUR'
);

-- Inserir chaves PIX
INSERT INTO chaves_pix (conta_id, tipo_chave, chave, chave_hash, ativa, principal) VALUES
(1, 'CPF', 'ENCRYPTED_00000000000', SHA2('00000000000', 256), TRUE, TRUE);

-- Inserir cotações iniciais
INSERT INTO cotacoes_moedas (moeda_origem, moeda_destino, taxa_compra, taxa_venda, taxa_media, fonte, valido_ate) VALUES
('BRL', 'EUR', 0.180000, 0.185000, 0.182500, 'Banco Central', DATE_ADD(NOW(), INTERVAL 1 DAY)),
('EUR', 'BRL', 5.400000, 5.550000, 5.475000, 'Banco Central', DATE_ADD(NOW(), INTERVAL 1 DAY)),
('BRL', 'USD', 0.200000, 0.205000, 0.202500, 'Banco Central', DATE_ADD(NOW(), INTERVAL 1 DAY)),
('USD', 'BRL', 4.900000, 5.050000, 4.975000, 'Banco Central', DATE_ADD(NOW(), INTERVAL 1 DAY)),
('EUR', 'USD', 1.090000, 1.095000, 1.092500, 'BCE', DATE_ADD(NOW(), INTERVAL 1 DAY)),
('USD', 'EUR', 0.910000, 0.915000, 0.912500, 'BCE', DATE_ADD(NOW(), INTERVAL 1 DAY));

-- ========================================
-- TRIGGERS DE AUDITORIA
-- ========================================

DELIMITER $$

CREATE TRIGGER trg_usuarios_audit_insert
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (usuario_id, acao, tabela, registro_id, dados_novos)
    VALUES (NEW.id, 'INSERT', 'usuarios', NEW.id, JSON_OBJECT('nome', NEW.nome, 'email_hash', NEW.email_hash));
END$$

CREATE TRIGGER trg_transacoes_audit_insert
AFTER INSERT ON transacoes
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (usuario_id, acao, tabela, registro_id, dados_novos)
    VALUES (
        (SELECT usuario_id FROM contas WHERE id = NEW.conta_origem_id),
        'INSERT', 'transacoes', NEW.id,
        JSON_OBJECT('tipo', NEW.tipo_transacao, 'valor', NEW.valor, 'status', NEW.status)
    );
END$$

DELIMITER ;

-- ========================================
-- VIEWS ÚTEIS
-- ========================================

-- View: Saldo consolidado por usuário
CREATE OR REPLACE VIEW v_saldos_consolidados AS
SELECT 
    u.id AS usuario_id,
    u.nome,
    u.sobrenome,
    u.nacionalidade,
    c.id AS conta_id,
    c.numero_conta,
    c.moeda_principal,
    c.saldo_brl,
    c.saldo_eur,
    c.saldo_usd,
    (c.saldo_brl + (c.saldo_eur * 5.5) + (c.saldo_usd * 5.0)) AS saldo_total_brl_equivalente
FROM usuarios u
JOIN contas c ON u.id = c.usuario_id
WHERE u.ativo = TRUE AND c.status_conta = 'Ativa';

-- View: Transações do dia
CREATE OR REPLACE VIEW v_transacoes_hoje AS
SELECT 
    t.*,
    co.numero_conta AS conta_origem,
    cd.numero_conta AS conta_destino,
    uo.nome AS usuario_origem_nome
FROM transacoes t
LEFT JOIN contas co ON t.conta_origem_id = co.id
LEFT JOIN contas cd ON t.conta_destino_id = cd.id
LEFT JOIN usuarios uo ON co.usuario_id = uo.id
WHERE DATE(t.data_transacao) = CURDATE();

-- ========================================
-- ÍNDICES ADICIONAIS PARA PERFORMANCE
-- ========================================

CREATE INDEX idx_transacoes_data_tipo ON transacoes(data_transacao, tipo_transacao);
CREATE INDEX idx_transacoes_valor ON transacoes(valor);
CREATE INDEX idx_sessoes_usuario_ativo ON sessoes(usuario_id, revogado);
CREATE INDEX idx_investimentos_rentabilidade ON investimentos(rentabilidade_percentual);

-- ========================================
-- FIM DO SCRIPT
-- ========================================
