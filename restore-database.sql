-- Restaurar banco de dados
USE java;

-- Passo 1: Remover FKs
ALTER TABLE contas DROP FOREIGN KEY contas_ibfk_1;

-- Passo 2: Renomear tabelas
DROP TABLE IF EXISTS usuarios;
RENAME TABLE usuarios_new TO usuarios;

-- Passo 3: Converter usuario_id em contas para BIGINT
ALTER TABLE contas MODIFY COLUMN usuario_id BIGINT NOT NULL;

-- Passo 4: Recriar FK
ALTER TABLE contas ADD CONSTRAINT fk_contas_usuario 
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE;

-- Passo 5: Verificar transacoes
ALTER TABLE transacoes MODIFY COLUMN conta_origem_id BIGINT;
ALTER TABLE transacoes MODIFY COLUMN conta_destino_id BIGINT;

-- Verificação
SELECT 'Restauração concluída!' AS status;
DESCRIBE usuarios;
DESCRIBE contas;
