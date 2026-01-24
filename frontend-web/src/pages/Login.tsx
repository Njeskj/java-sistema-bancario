import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    navigate('/dashboard');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Paper sx={{ 
        p: 4, 
        maxWidth: 400, 
        width: '100%',
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
          iBank
        </Typography>
        <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mb: 3 }}>
          Acesse sua conta
        </Typography>
        
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          sx={{ mb: 3 }}
        />
        
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          sx={{ 
            py: 1.5, 
            mb: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          Entrar
        </Button>
        
        <Box textAlign="center">
          <Link href="#" variant="body2">
            Esqueceu a senha?
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}
