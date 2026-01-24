import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Button,
  Chip,
} from '@mui/material';
import { TrendingUp, Add } from '@mui/icons-material';

export default function Investments() {
  const investimentos = [
    {
      id: 1,
      tipo: 'CDB',
      nome: 'CDB Banco XYZ',
      valorInvestido: 10000,
      valorAtual: 10450,
      rentabilidade: 4.5,
      vencimento: '2026-12-31',
      liquidez: 'No Vencimento',
    },
    {
      id: 2,
      tipo: 'Tesouro Direto',
      nome: 'Tesouro Selic 2027',
      valorInvestido: 5000,
      valorAtual: 5180,
      rentabilidade: 3.6,
      vencimento: '2027-03-01',
      liquidez: 'Diária',
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Investimentos
        </Typography>
        <Button variant="contained" startIcon={<Add />}>
          Novo Investimento
        </Button>
      </Box>

      {/* Resumo */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <Typography variant="h6">Total Investido</Typography>
            <Typography variant="h3" fontWeight={700} sx={{ mt: 2 }}>
              R$ 15.000,00
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <Typography variant="h6">Valor Atual</Typography>
            <Typography variant="h3" fontWeight={700} sx={{ mt: 2 }}>
              R$ 15.630,00
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <Typography variant="h6">Rentabilidade</Typography>
            <Typography variant="h3" fontWeight={700} sx={{ mt: 2 }}>
              +4.2%
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Lista de Investimentos */}
      <Grid container spacing={3}>
        {investimentos.map((inv) => (
          <Grid item xs={12} md={6} key={inv.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Chip label={inv.tipo} size="small" color="primary" sx={{ mb: 1 }} />
                    <Typography variant="h6" fontWeight={600}>
                      {inv.nome}
                    </Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 40, color: '#4caf50' }} />
                </Box>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Investido
                    </Typography>
                    <Typography variant="h6">
                      R$ {inv.valorInvestido.toLocaleString('pt-BR')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Valor Atual
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      R$ {inv.valorAtual.toLocaleString('pt-BR')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Rentabilidade
                    </Typography>
                    <Typography variant="body1" fontWeight={600} color="success.main">
                      +{inv.rentabilidade}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Liquidez
                    </Typography>
                    <Typography variant="body1">
                      {inv.liquidez}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="caption" color="text.secondary">
                    Vencimento: {new Date(inv.vencimento).toLocaleDateString('pt-BR')}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={65}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
