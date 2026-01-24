import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Tab,
  Tabs,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Zoom,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Send,
  QrCode2,
  AccountBalance,
  SwapHoriz,
  Add,
  ContentCopy,
  Star,
  Edit,
} from '@mui/icons-material';

export default function Transactions() {
  const [tabValue, setTabValue] = useState(0);
  const [openPix, setOpenPix] = useState(false);

  const chavesPix = [
    { tipo: 'CPF', chave: '000.000.000-00', principal: true },
    { tipo: 'Email', chave: 'israel@ibank.com', principal: false },
    { tipo: 'Telefone', chave: '+55 11 98765-4321', principal: false },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Fade in timeout={600}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight={700} sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3
          }}>
            💸 Transações
          </Typography>
        </Box>
      </Fade>

      <Zoom in timeout={800}>
        <Paper sx={{ 
          mb: 3, 
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <Tabs 
            value={tabValue} 
            onChange={(_, v) => setTabValue(v)}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
                py: 2.5,
              }
            }}
          >
            <Tab label="⚡ PIX" />
            <Tab label="🏦 Transferência" />
            <Tab label="📄 TED/DOC" />
            <Tab label="🌍 Internacional" />
          </Tabs>
        </Paper>
      </Zoom>

      {/* PIX */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Paper sx={{ 
                p: 4, 
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                background: 'white'
              }}>
                <Typography variant="h6" gutterBottom fontWeight={700} sx={{ mb: 3 }}>
                  ⚡ Enviar PIX
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Chave PIX"
                    placeholder="CPF, Email, Telefone ou Chave Aleatória"
                    sx={{ 
                      mb: 2.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Valor"
                    type="number"
                    placeholder="R$ 0,00"
                    sx={{ 
                      mb: 2.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Descrição (opcional)"
                    multiline
                    rows={3}
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  sx={{ mb: 3 }}
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<QrCode2 />}
                      sx={{ py: 1.5 }}
                    >
                      QR Code
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Send />}
                      sx={{ py: 1.5 }}
                      onClick={() => setOpenPix(true)}
                    >
                      Enviar
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
            </Fade>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Minhas Chaves PIX
                </Typography>
                <IconButton color="primary">
                  <Add />
                </IconButton>
              </Box>
              {chavesPix.map((chave, index) => (
                <Card key={index} sx={{ mb: 2, bgcolor: chave.principal ? '#f0f7ff' : 'white' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {chave.tipo}
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {chave.chave}
                        </Typography>
                      </Box>
                      <Box>
                        {chave.principal && (
                          <Chip label="Principal" color="primary" size="small" sx={{ mr: 1 }} />
                        )}
                        <IconButton size="small">
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Paper>
          </Grid>

          {/* Limites */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Limites de Transação
              </Typography>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Limite PIX Diário
                    </Typography>
                    <Typography variant="h6" color="primary">
                      R$ 5.000,00
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      Disponível: R$ 4.850,00
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Limite Transferência
                    </Typography>
                    <Typography variant="h6" color="primary">
                      R$ 10.000,00
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      Disponível: R$ 10.000,00
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Limite Internacional
                    </Typography>
                    <Typography variant="h6" color="primary">
                      R$ 3.000,00
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      Disponível: R$ 3.000,00
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Limite Saque
                    </Typography>
                    <Typography variant="h6" color="primary">
                      R$ 2.000,00
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      Disponível: R$ 2.000,00
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Dialog de confirmação */}
      <Dialog open={openPix} onClose={() => setOpenPix(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirmar PIX</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary">Para</Typography>
            <Typography variant="h6" gutterBottom>João Silva</Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Chave</Typography>
            <Typography variant="body1" gutterBottom>123.456.789-00</Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Valor</Typography>
            <Typography variant="h4" color="primary" gutterBottom>R$ 150,00</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPix(false)}>Cancelar</Button>
          <Button variant="contained" onClick={() => setOpenPix(false)}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
