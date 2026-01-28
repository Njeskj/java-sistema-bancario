USE java;
UPDATE usuarios SET senha = '$2a$10$N9qo8uLOickgx2ZMRZoMye7J9K2B9qJz7g0r7i0bFBqQz0B0K0K0K' WHERE email = 'admin@ibank.com';
SELECT email, LEFT(senha, 20) as senha_hash FROM usuarios WHERE email = 'admin@ibank.com';
