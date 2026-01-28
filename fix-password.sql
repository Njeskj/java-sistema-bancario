USE java;

-- Atualizar senha para usuário 2  
UPDATE usuarios 
SET senha_hash = CONCAT('$2a', '$10', '$N9qo8uLOickgx2ZMRZoMye7J9K2B9qJz7g0r7i0bFBqQz0B0K0K0K')
WHERE id = 2;

-- Verificar
SELECT id, nome, email, LEFT(senha_hash, 30) AS senha_preview FROM usuarios;
