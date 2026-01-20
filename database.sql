CREATE DATABASE IF NOT EXISTS java CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE java;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    sobrenome VARCHAR(50) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    rg VARCHAR(15),
    telefone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    nome_mae VARCHAR(100),
    nome_pai VARCHAR(100),
    escolaridade VARCHAR(50),
    estado_civil VARCHAR(20),
    nacionalidade VARCHAR(50),
    naturalidade VARCHAR(50),
    sexo VARCHAR(20),
    ano_nascimento INT,
    idade INT,
    profissao VARCHAR(50),
    empresa VARCHAR(100),
    cargo VARCHAR(50),
    departamento VARCHAR(50),
    endereco TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cpf (cpf),
    INDEX idx_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    banco VARCHAR(50) NOT NULL DEFAULT 'IBank',
    agencia VARCHAR(10) NOT NULL,
    numero_conta VARCHAR(20) NOT NULL UNIQUE,
    tipo_conta ENUM('Corrente', 'Poupanca', 'Salario') DEFAULT 'Corrente',
    titular VARCHAR(100) NOT NULL,
    cpf_titular VARCHAR(14) NOT NULL,
    saldo DECIMAL(15, 2) DEFAULT 0.00,
    limite_credito DECIMAL(15, 2) DEFAULT 0.00,
    limite_pix_diario DECIMAL(15, 2) DEFAULT 5000.00,
    limite_transferencia_diario DECIMAL(15, 2) DEFAULT 10000.00,
    codigo_seguranca INT NOT NULL,
    status_conta ENUM('Ativa', 'Bloqueada', 'Inativa') DEFAULT 'Ativa',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_cpf_titular (cpf_titular),
    INDEX idx_numero_conta (numero_conta),
    INDEX idx_status (status_conta)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS transacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conta_origem VARCHAR(20) NOT NULL,
    conta_destino VARCHAR(20),
    tipo ENUM('DEPOSITO', 'SAQUE', 'TRANSFERENCIA_ENVIADA', 'TRANSFERENCIA_RECEBIDA', 'PIX_ENVIADO', 'PIX_RECEBIDO', 'PAGAMENTO', 'EMPRESTIMO') NOT NULL,
    valor DECIMAL(15, 2) NOT NULL,
    saldo_anterior DECIMAL(15, 2),
    saldo_posterior DECIMAL(15, 2),
    descricao TEXT,
    codigo_autenticacao VARCHAR(50),
    status ENUM('CONCLUIDA', 'PENDENTE', 'CANCELADA', 'ERRO') DEFAULT 'CONCLUIDA',
    data_transacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conta_origem) REFERENCES contas(numero_conta),
    INDEX idx_conta_origem (conta_origem),
    INDEX idx_tipo (tipo),
    INDEX idx_data (data_transacao),
    INDEX idx_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pagamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conta_numero VARCHAR(20) NOT NULL,
    tipo_pagamento ENUM('CONTA_LUZ', 'CONTA_AGUA', 'CONTA_TELEFONE', 'BOLETO', 'OUTROS') NOT NULL,
    codigo_barras VARCHAR(100),
    valor DECIMAL(15, 2) NOT NULL,
    descricao VARCHAR(255),
    data_vencimento DATE,
    data_pagamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PAGO', 'PENDENTE', 'CANCELADO') DEFAULT 'PAGO',
    FOREIGN KEY (conta_numero) REFERENCES contas(numero_conta),
    INDEX idx_conta (conta_numero),
    INDEX idx_status (status),
    INDEX idx_data_pagamento (data_pagamento)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS emprestimos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conta_numero VARCHAR(20) NOT NULL,
    valor_solicitado DECIMAL(15, 2) NOT NULL,
    valor_aprovado DECIMAL(15, 2),
    taxa_juros DECIMAL(5, 2) NOT NULL,
    parcelas INT NOT NULL,
    valor_parcela DECIMAL(15, 2),
    parcelas_pagas INT DEFAULT 0,
    status ENUM('PENDENTE', 'APROVADO', 'REJEITADO', 'ATIVO', 'QUITADO') DEFAULT 'PENDENTE',
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_aprovacao TIMESTAMP NULL,
    FOREIGN KEY (conta_numero) REFERENCES contas(numero_conta),
    INDEX idx_conta (conta_numero),
    INDEX idx_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS chaves_pix (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conta_numero VARCHAR(20) NOT NULL,
    tipo_chave ENUM('CPF', 'EMAIL', 'TELEFONE', 'ALEATORIA') NOT NULL,
    chave VARCHAR(100) NOT NULL UNIQUE,
    ativa BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conta_numero) REFERENCES contas(numero_conta),
    INDEX idx_chave (chave),
    INDEX idx_conta (conta_numero)
) ENGINE=InnoDB;

-- Inserir usuário de teste
INSERT INTO usuarios (nome, sobrenome, cpf, rg, telefone, email, nome_mae, nome_pai, escolaridade, estado_civil, nacionalidade, naturalidade, sexo, ano_nascimento, idade, profissao, empresa, cargo, departamento, endereco)
VALUES ('Admin', 'Teste', '000.000.000-00', '00.000.000-0', '(00) 00000-0000', 'admin@ibank.com', 'Mae Teste', 'Pai Teste', 'Superior', 'Solteiro', 'Brasileiro', 'Teste', 'Masculino', 1990, 36, 'Administrador', 'IBank', 'Admin', 'TI', 'Rua Teste, 0 - Centro, Teste - TE, 00000-000, Brasil');

-- Inserir conta de teste
INSERT INTO contas (usuario_id, banco, agencia, numero_conta, tipo_conta, titular, cpf_titular, saldo, limite_credito, codigo_seguranca, status_conta)
VALUES (1, 'IBank', '0001', '0000000-0', 'Corrente', 'Admin Macedo Teste', '000.000.000-00', 5000.00, 10000.00, 123456, 'Ativa');

-- Inserir chave PIX de teste
INSERT INTO chaves_pix (conta_numero, tipo_chave, chave)
VALUES ('0000000-0', 'CPF', '000.000.000-00');
