import React from 'react';
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
} from '@mui/material';
import { Save, Security, Language, Palette } from '@mui/icons-material';

export default function Settings() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Configurações
      </Typography>

      <Grid container spacing={3}>
        {/* Perfil */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Perfil
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 80, height: 80, mr: 2, bgcolor: '#667eea' }}>
                IS
              </Avatar>
              <Button variant="outlined">Alterar Foto</Button>
            </Box>
            <TextField fullWidth label="Nome" defaultValue="Israel" sx={{ mb: 2 }} />
            <TextField fullWidth label="Sobrenome" defaultValue="Silva" sx={{ mb: 2 }} />
            <TextField fullWidth label="Email" defaultValue="israel@ibank.com" sx={{ mb: 2 }} />
            <TextField fullWidth label="Telefone" defaultValue="+55 11 98765-4321" sx={{ mb: 2 }} />
            <Button variant="contained" startIcon={<Save />}>
              Salvar Alterações
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
                control={<Switch defaultChecked />}
                label="Autenticação de Dois Fatores (2FA)"
                sx={{ mb: 2, display: 'block' }}
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Login com Biometria"
                sx={{ mb: 2, display: 'block' }}
              />
              <FormControlLabel
                control={<Switch />}
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
              <Select fullWidth defaultValue="pt-BR" sx={{ mb: 3 }}>
                <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
                <MenuItem value="pt-PT">Português (Portugal)</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Moeda Principal
              </Typography>
              <Select fullWidth defaultValue="BRL" sx={{ mb: 3 }}>
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
                  defaultValue="5000"
                  InputProps={{ startAdornment: 'R$' }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Limite Transferência"
                  type="number"
                  defaultValue="10000"
                  InputProps={{ startAdornment: 'R$' }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Limite Internacional"
                  type="number"
                  defaultValue="3000"
                  InputProps={{ startAdornment: 'R$' }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Limite Saque"
                  type="number"
                  defaultValue="2000"
                  InputProps={{ startAdornment: 'R$' }}
                />
              </Grid>
            </Grid>
            <Button variant="contained" startIcon={<Save />} sx={{ mt: 3 }}>
              Salvar Limites
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
