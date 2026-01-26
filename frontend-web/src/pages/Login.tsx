import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Link, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../components/Toast';

export default function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      showToast('Por favor, preencha email e senha', 'warning');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        emailOuCpf: email,
        senha: senha
      });

      // Salvar token no localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('usuarioId', String(response.data.usuarioId || ''));
        localStorage.setItem('nomeCompleto', response.data.nomeCompleto || 'Usuário');
        localStorage.setItem('email', response.data.email || '');
        localStorage.setItem('user', JSON.stringify({
          id: response.data.usuarioId,
          nome: response.data.nomeCompleto?.split(' ')[0] || '',
          email: response.data.email,
          nacionalidade: response.data.nacionalidade,
          moedaPreferencial: response.data.moedaPreferencial,
          idioma: response.data.idioma
        }));
        showToast('Login realizado com sucesso!', 'success');
        navigate('/dashboard');
      } else {
        showToast('Resposta inválida do servidor', 'error');
      }
    } catch (err: any) {
      console.error('Erro no login:', err);
      if (err.response) {
        showToast(err.response.data.message || 'Email ou senha incorretos', 'error');
      } else if (err.request) {
        showToast('Não foi possível conectar ao servidor. Verifique se o backend está rodando.', 'error');
      } else {
        showToast('Erro ao fazer login. Tente novamente.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)',
      padding: 2
    }}>
      <Paper sx={{ 
        p: 4, 
        maxWidth: 400, 
        width: '100%',
        margin: 'auto',
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
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          data-testid="input-email"
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="Senha"
          type="password"
          name="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          disabled={loading}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          data-testid="input-password"
          sx={{ mb: 3 }}
        />
        
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          disabled={loading}
          data-testid="btn-login"
          sx={{ 
            py: 1.5, 
            mb: 2,
            background: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)'
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Link 
            href="#" 
            variant="body2"
            data-testid="link-forgot-password"
          >
            Esqueceu a senha?
          </Link>
        </Box>

        <Box 
          sx={{ 
            textAlign: 'center', 
            pt: 2, 
            borderTop: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Não tem uma conta?
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate('/register')}
            data-testid="btn-go-to-register"
            sx={{ mt: 1 }}
          >
            Criar Conta Grátis
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            variant="text"
            size="small"
            onClick={() => navigate('/')}
            data-testid="btn-back-to-home"
            sx={{ textTransform: 'none' }}
          >
            ← Voltar para página inicial
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
