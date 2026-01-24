import React from 'react';
import { Box, Paper, Typography, TextField, Button, Grid, Card, CardContent, Chip, Fade, Zoom, Avatar, IconButton } from '@mui/material';
import { Payment as PaymentIcon, Schedule, QrCode2, CameraAlt, Bolt, Receipt } from '@mui/icons-material';

export default function Payments() {
  const pagamentosAgendados = [
    { id: 1, tipo: 'Luz', favorecido: 'Enel', valor: 340.50, vencimento: '2026-01-28', status: 'Agendado' },
    { id: 2, tipo: 'Água', favorecido: 'Sabesp', valor: 89.90, vencimento: '2026-02-05', status: 'Pendente' },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Fade in timeout={600}>
        <Typography variant="h4" gutterBottom fontWeight={700} sx={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 3
        }}>
          💳 Pagamentos
        </Typography>
      </Fade>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Zoom in timeout={800}>
            <Paper sx={{ 
              p: 4, 
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              background: 'white'
            }}>
              <Typography variant="h6" gutterBottom fontWeight={700} sx={{ mb: 3 }}>
                📄 Pagar Conta
              </Typography>
              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Código de Barras"
                  placeholder="Digite ou escaneie o código"
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
                <Button
                fullWidth
                variant="outlined"
                startIcon={<QrCode2 />}
                sx={{ mb: 3, py: 1.5 }}
              >
                Escanear Código de Barras
              </Button>
              <Button
                fullWidth
                variant="contained"
                startIcon={<PaymentIcon />}
                sx={{ py: 1.5 }}
              >
                Pagar Agora
              </Button>
            </Box>
          </Paper>
          </Zoom>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Pagamentos Agendados
            </Typography>
            {pagamentosAgendados.map((pag) => (
              <Card key={pag.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {pag.tipo}
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {pag.favorecido}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Vencimento: {new Date(pag.vencimento).toLocaleDateString('pt-BR')}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" color="primary">
                        R$ {pag.valor.toFixed(2)}
                      </Typography>
                      <Chip label={pag.status} size="small" color="primary" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
