import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  Avatar,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Save, Security, Language, Palette } from '@mui/icons-material';
import api from '../services/api';

interface UserData {
  id: number;
  nome: string;
  sobrenome: string;
  nomeCompleto: string;
  email: string;
  cpf: string;
  telefone: string;
  telefonePais: string;
  idioma: string;
  moedaPreferencial: string;
  doisFatoresAtivo: boolean;
  conta?: {
    agencia: string;
    numeroConta: string;
    digitoVerificador: string;
    tipoConta: string;
    limitePixDiario: number;
    limiteTransferenciaDiario: number;
    limiteInternacionalDiario: number;
    limiteSaqueDiario: number;
    biometriaAtiva: boolean;
    requer2faTransacoes: boolean;
  };
}

export default function Settings() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    telefone: '',
    idioma: 'pt-BR',
    moedaPreferencial: 'BRL',
  });
  
  const [limites, setLimites] = useState({
    limitePixDiario: 5000,
    limiteTransferenciaDiario: 10000,
    limiteInternacionalDiario: 3000,
    limiteSaqueDiario: 2000,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usuario/perfil');
      const data = response.data;
      
      setUserData(data);
      setFormData({
        nome: data.nome || '',
        sobrenome: data.sobrenome || '',
        telefone: data.telefone || '',
        idioma: data.idioma || 'pt-BR',
        moedaPreferencial: data.moedaPreferencial || 'BRL',
      });
      
      if (data.conta) {
        setLimites({
          limitePixDiario: data.conta.limitePixDiario || 5000,
          limiteTransferenciaDiario: data.conta.limiteTransferenciaDiario || 10000,
          limiteInternacionalDiario: data.conta.limiteInternacionalDiario || 3000,
          limiteSaqueDiario: data.conta.limiteSaqueDiario || 2000,
        });
      }
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar dados do perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePerfil = async () => {
    try {
      setSaving(true);
      await api.put('/usuario/perfil', formData);
      
      // Atualizar localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...user,
        nome: formData.nome,
        idioma: formData.idioma,
        moedaPreferencial: formData.moedaPreferencial
      }));
      localStorage.setItem('nomeCompleto', `${formData.nome} ${formData.sobrenome}`);
      
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      loadUserData();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar alterações' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLimites = async () => {
    try {
      setSaving(true);
      await api.put('/usuario/limites', limites);
      setMessage({ type: 'success', text: 'Limites atualizados com sucesso!' });
      loadUserData();
    } catch (error) {
      console.error('Erro ao salvar limites:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar limites' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const getInitials = () => {
    if (!userData) return 'US';
    return `${userData.nome.charAt(0)}${userData.sobrenome.charAt(0)}`.toUpperCase();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Configurações
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Perfil */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Perfil
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 80, height: 80, mr: 2, bgcolor: '#667eea' }}>
                {getInitials()}
              </Avatar>
              <Button variant="outlined">Alterar Foto</Button>
            </Box>
            <TextField 
              fullWidth 
              label="Nome" 
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Sobrenome" 
              value={formData.sobrenome}
              onChange={(e) => setFormData({...formData, sobrenome: e.target.value})}
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Email" 
              value={userData?.email || ''}
              disabled
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="CPF" 
              value={userData?.cpf || ''}
              disabled
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Telefone" 
              value={formData.telefone}
              onChange={(e) => setFormData({...formData, telefone: e.target.value})}
              inputProps={{ 'data-testid': 'input-telefone' }}
              sx={{ mb: 2 }} 
            />
            <Button 
              variant="contained" 
              startIcon={<Save />}
              onClick={handleSavePerfil}
              disabled={saving}
              data-testid="btn-salvar-perfil"
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </Paper>
        </Grid>

        {/* Segurança */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
              Segurança
            </Typography>
            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={<Switch checked={userData?.doisFatoresAtivo || false} />}
                label="Autenticação de Dois Fatores (2FA)"
                sx={{ mb: 2, display: 'block' }}
              />
              <FormControlLabel
                control={<Switch checked={userData?.conta?.biometriaAtiva || false} />}
                label="Login com Biometria"
                sx={{ mb: 2, display: 'block' }}
              />
              <FormControlLabel
                control={<Switch checked={userData?.conta?.requer2faTransacoes || false} />}
                label="2FA para Transações Altas"
                sx={{ mb: 3, display: 'block' }}
              />
              <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
                Alterar Senha
              </Button>
              <Button variant="outlined" fullWidth>
                Gerenciar Dispositivos
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Preferências */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              <Language sx={{ mr: 1, verticalAlign: 'middle' }} />
              Internacionalização
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Idioma
              </Typography>
              <Select 
                fullWidth 
                value={formData.idioma}
                onChange={(e) => setFormData({...formData, idioma: e.target.value})}
                sx={{ mb: 3 }}
              >
                <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
                <MenuItem value="pt-PT">Português (Portugal)</MenuItem>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Español</MenuItem>
              </Select>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Moeda Principal
              </Typography>
              <Select 
                fullWidth 
                value={formData.moedaPreferencial}
                onChange={(e) => setFormData({...formData, moedaPreferencial: e.target.value})}
                sx={{ mb: 3 }}
              >
                <MenuItem value="BRL">Real (BRL)</MenuItem>
                <MenuItem value="EUR">Euro (EUR)</MenuItem>
                <MenuItem value="USD">Dólar (USD)</MenuItem>
              </Select>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Fuso Horário
              </Typography>
              <Select fullWidth defaultValue="America/Sao_Paulo">
                <MenuItem value="America/Sao_Paulo">Brasília (GMT-3)</MenuItem>
                <MenuItem value="Europe/Lisbon">Lisboa (GMT+0)</MenuItem>
                <MenuItem value="America/New_York">Nova York (GMT-5)</MenuItem>
              </Select>
            </Box>
          </Paper>
        </Grid>

        {/* Notificações */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Notificações
            </Typography>
            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Transações"
                sx={{ mb: 2, display: 'block' }}
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Pagamentos Vencendo"
                sx={{ mb: 2, display: 'block' }}
              />
              <FormControlLabel
                control={<Switch />}
                label="Promoções e Ofertas"
                sx={{ mb: 2, display: 'block' }}
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Alertas de Segurança"
                sx={{ mb: 2, display: 'block' }}
              />
              <FormControlLabel
                control={<Switch />}
                label="Novidades do IBank"
                sx={{ display: 'block' }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Limites Personalizados */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Limites Personalizados
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Limite PIX Diário"
                  type="number"
                  value={limites.limitePixDiario}
                  onChange={(e) => setLimites({...limites, limitePixDiario: Number(e.target.value)})}
                  InputProps={{ startAdornment: 'R$' }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Limite Transferência"
                  type="number"
                  value={limites.limiteTransferenciaDiario}
                  onChange={(e) => setLimites({...limites, limiteTransferenciaDiario: Number(e.target.value)})}
                  InputProps={{ startAdornment: 'R$' }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Limite Internacional"
                  type="number"
                  value={limites.limiteInternacionalDiario}
                  onChange={(e) => setLimites({...limites, limiteInternacionalDiario: Number(e.target.value)})}
                  InputProps={{ startAdornment: 'R$' }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Limite Saque"
                  type="number"
                  value={limites.limiteSaqueDiario}
                  onChange={(e) => setLimites({...limites, limiteSaqueDiario: Number(e.target.value)})}
                  InputProps={{ startAdornment: 'R$' }}
                />
              </Grid>
            </Grid>
            <Button 
              variant="contained" 
              startIcon={<Save />} 
              sx={{ mt: 3 }}
              onClick={handleSaveLimites}
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar Limites'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
