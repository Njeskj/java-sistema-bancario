-- Performance Optimization Indexes
-- IBank Database - Índices para otimização de queries

USE java;

-- Índices para tabela usuarios
CREATE INDEX idx_usuarios_cpf_hash ON usuarios(cpf_hash);
CREATE INDEX idx_usuarios_email_hash ON usuarios(email_hash);
CREATE INDEX idx_usuarios_ativo ON usuarios(ativo);
CREATE INDEX idx_usuarios_conta_bloqueada ON usuarios(conta_bloqueada);
CREATE INDEX idx_usuarios_dois_fatores ON usuarios(dois_fatores_ativo);
CREATE INDEX idx_usuarios_nacionalidade ON usuarios(nacionalidade);
CREATE INDEX idx_usuarios_data_cadastro ON usuarios(data_cadastro);
CREATE INDEX idx_usuarios_ultimo_login ON usuarios(data_ultimo_login);

-- Índices para tabela contas
CREATE INDEX idx_contas_usuario_id ON contas(usuario_id);
CREATE INDEX idx_contas_numero ON contas(numero_conta);
CREATE INDEX idx_contas_tipo ON contas(tipo_conta);
CREATE INDEX idx_contas_status ON contas(status);
CREATE INDEX idx_contas_moeda ON contas(moeda);
CREATE INDEX idx_contas_data_criacao ON contas(data_criacao);
CREATE INDEX idx_contas_ativa ON contas(ativa);

-- Índice composto para busca de conta ativa por usuário
CREATE INDEX idx_contas_usuario_ativa ON contas(usuario_id, ativa);

-- Índices para tabela transacoes
CREATE INDEX idx_transacoes_conta_origem ON transacoes(conta_origem_id);
CREATE INDEX idx_transacoes_conta_destino ON transacoes(conta_destino_id);
CREATE INDEX idx_transacoes_tipo ON transacoes(tipo);
CREATE INDEX idx_transacoes_status ON transacoes(status);
CREATE INDEX idx_transacoes_data ON transacoes(data_transacao);
CREATE INDEX idx_transacoes_data_desc ON transacoes(data_transacao DESC);

-- Índice composto para histórico de transações por conta
CREATE INDEX idx_transacoes_conta_data ON transacoes(conta_origem_id, data_transacao DESC);
CREATE INDEX idx_transacoes_destino_data ON transacoes(conta_destino_id, data_transacao DESC);

-- Índice para transações por período
CREATE INDEX idx_transacoes_periodo ON transacoes(data_transacao, conta_origem_id);

-- Índices para tabela cartoes (se existir)
-- CREATE INDEX idx_cartoes_conta_id ON cartoes(conta_id);
-- CREATE INDEX idx_cartoes_numero_hash ON cartoes(numero_hash);
-- CREATE INDEX idx_cartoes_status ON cartoes(status);
-- CREATE INDEX idx_cartoes_validade ON cartoes(data_validade);

-- Índices para tabela refresh_tokens
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_username ON refresh_tokens(username);
CREATE INDEX idx_refresh_tokens_expiry ON refresh_tokens(expiry_date);
CREATE INDEX idx_refresh_tokens_revoked ON refresh_tokens(revoked);

-- Índice composto para limpeza de tokens expirados
CREATE INDEX idx_refresh_tokens_cleanup ON refresh_tokens(expiry_date, revoked);

-- Análise de performance (opcional - executar após criar índices)
-- ANALYZE TABLE usuarios;
-- ANALYZE TABLE contas;
-- ANALYZE TABLE transacoes;
-- ANALYZE TABLE refresh_tokens;

-- Verificar índices criados
-- SHOW INDEX FROM usuarios;
-- SHOW INDEX FROM contas;
-- SHOW INDEX FROM transacoes;
-- SHOW INDEX FROM refresh_tokens;
