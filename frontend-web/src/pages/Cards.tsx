import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Switch,
  IconButton,
  Chip,
  Fade,
  Zoom,
  Avatar,
} from '@mui/material';
import { CreditCard, Block, Lock, Add, Visibility, Settings, ContactlessOutlined } from '@mui/icons-material';

export default function Cards() {
  const [showNumbers, setShowNumbers] = useState(false);
  
  const cartoes = [
    {
      id: 1,
      tipo: 'Crédito',
      numero: '**** **** **** 1234',
      numeroCompleto: '4532 1234 5678 1234',
      nome: 'ISRAEL SILVA',
      bandeira: 'Visa',
      limite: 10000,
      utilizado: 3500,
      vencimento: '12/28',
      cvv: '123',
      bloqueado: false,
      cor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: 2,
      tipo: 'Débito',
      numero: '**** **** **** 5678',
      numeroCompleto: '5412 7534 8765 5678',
      nome: 'ISRAEL SILVA',
      bandeira: 'Mastercard',
      vencimento: '06/27',
      cvv: '456',
      bloqueado: false,
      cor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Fade in timeout={600}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" fontWeight={700} sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            💳 Meus Cartões
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 24px rgba(102, 126, 234, 0.4)',
              }
            }}
          >
            Solicitar Cartão
          </Button>
        </Box>
      </Fade>

      <Grid container spacing={3}>
        {cartoes.map((cartao, index) => (
          <Grid item xs={12} md={6} key={cartao.id}>
            <Zoom in timeout={800 + (index * 200)}>
              <Card
                sx={{
                  background: cartao.cor,
                  color: 'white',
                  borderRadius: 4,
                  position: 'relative',
                  overflow: 'visible',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 12px 48px rgba(0,0,0,0.2)',
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ContactlessOutlined sx={{ fontSize: 32 }} />
                      <Chip
                        label={cartao.tipo}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.25)',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                        }}
                      />
                    </Box>
                    <IconButton 
                      onClick={() => setShowNumbers(!showNumbers)}
                      sx={{ color: 'white' }}
                    >
                      <Visibility />
                    </IconButton>
                  </Box>

                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 3, 
                      fontFamily: 'monospace', 
                      letterSpacing: 3,
                      fontWeight: 600 
                    }}
                  >
                    {showNumbers ? cartao.numeroCompleto : cartao.numero}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
                        Nome do Titular
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>
                        {cartao.nome}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
                        Validade
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>
                        {cartao.vencimento}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
                        CVV
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>
                        {showNumbers ? cartao.cvv : '•••'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      {/* Controles do Cartão */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {cartoes.map((cartao, index) => (
          <Grid item xs={12} md={6} key={`control-${cartao.id}`}>
            <Fade in timeout={1200 + (index * 200)}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  ⚙️ Controles - {cartao.tipo}
                </Typography>
                
                {cartao.tipo === 'Crédito' && (
                  <Box sx={{ mb: 3, mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Limite Utilizado
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        R$ {cartao.utilizado.toLocaleString('pt-BR')} / R$ {cartao.limite.toLocaleString('pt-BR')}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      height: 8, 
                      bgcolor: '#e0e0e0', 
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}>
                      <Box sx={{ 
                        width: `${(cartao.utilizado / cartao.limite) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        transition: 'width 0.5s ease'
                      }} />
                    </Box>
                  </Box>
                )}
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 2,
                      bgcolor: '#f5f7fa',
                      borderRadius: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Lock color="primary" />
                        <Typography fontWeight={600}>Cartão Bloqueado</Typography>
                      </Box>
                      <Switch checked={cartao.bloqueado} />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Settings />}
                      sx={{ 
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 600,
                        borderWidth: 2,
                        '&:hover': {
                          borderWidth: 2,
                        }
                      }}
                    >
                      Configurar
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Block />}
                      color="error"
                      sx={{ 
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 600
                      }}
                    >
                      Bloquear
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
