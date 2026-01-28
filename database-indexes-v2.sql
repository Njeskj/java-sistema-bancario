-- Performance Optimization Indexes (Ajustado para estrutura atual)
-- IBank Database - Índices para otimização de queries

USE java;

-- Índices para tabela usuarios (estrutura antiga)
CREATE INDEX idx_usuarios_ativo ON usuarios(ativo);
CREATE INDEX idx_usuarios_nacionalidade ON usuarios(nacionalidade);
CREATE INDEX idx_usuarios_data_criacao ON usuarios(data_criacao);

-- Índices para tabela contas
CREATE INDEX idx_contas_tipo ON contas(tipo_conta);
CREATE INDEX idx_contas_status ON contas(status_conta);
CREATE INDEX idx_contas_data_criacao ON contas(data_criacao);

-- Índices para tabela transacoes (se existir)
-- Verificar se tabela existe antes de criar índices
SET @tableName = 'transacoes';
SET @dbName = 'java';

SELECT COUNT(*) INTO @tableExists 
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = @dbName AND TABLE_NAME = @tableName;

-- Os índices abaixo só serão criados se a tabela transacoes existir
-- CREATE INDEX IF NOT EXISTS idx_transacoes_conta_origem ON transacoes(conta_origem_id);
-- CREATE INDEX IF NOT EXISTS idx_transacoes_conta_destino ON transacoes(conta_destino_id);
-- CREATE INDEX IF NOT EXISTS idx_transacoes_tipo ON transacoes(tipo);
-- CREATE INDEX IF NOT EXISTS idx_transacoes_status ON transacoes(status);
-- CREATE INDEX IF NOT EXISTS idx_transacoes_data ON transacoes(data_transacao);

-- Índices para tabela refresh_tokens
CREATE INDEX idx_rt_token ON refresh_tokens(token);
CREATE INDEX idx_rt_username ON refresh_tokens(username);
CREATE INDEX idx_rt_expiry ON refresh_tokens(expiry_date);
CREATE INDEX idx_rt_revoked ON refresh_tokens(revoked);
CREATE INDEX idx_rt_cleanup ON refresh_tokens(expiry_date, revoked);

-- Verificar índices criados
SELECT 'Índices criados com sucesso!' as Status;
