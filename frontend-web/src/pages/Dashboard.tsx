import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Paper,
  Avatar,
  Chip,
  LinearProgress,
  Fade,
  Grow,
  Zoom,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Visibility,
  VisibilityOff,
  SwapHoriz,
  Payment,
  CreditCard,
  Add,
  AccountBalanceWallet,
  Notifications,
  ArrowForward,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { t } = useTranslation();
  const [showBalance, setShowBalance] = useState(true);
  const [saldoTotal, setSaldoTotal] = useState(5000.00);
  const [limiteCredito, setLimiteCredito] = useState(10000.00);
  const [gastosDoMes, setGastosDoMes] = useState(2340.50);

  const transacoesRecentes = [
    { id: 1, tipo: 'PIX', valor: -150.00, descricao: 'Transferência para João', data: '2026-01-24' },
    { id: 2, tipo: 'Compra', valor: -89.90, descricao: 'Supermercado XYZ', data: '2026-01-23' },
    { id: 3, tipo: 'Depósito', valor: 1200.00, descricao: 'Salário', data: '2026-01-22' },
    { id: 4, tipo: 'Pagamento', valor: -340.50, descricao: 'Conta de luz', data: '2026-01-20' },
  ];

  const metasFinanceiras = [
    { id: 1, nome: 'Viagem para Europa', valorObjetivo: 10000, valorAtual: 3500, cor: '#4ECDC4' },
    { id: 2, nome: 'Reserva de Emergência', valorObjetivo: 15000, valorAtual: 8200, cor: '#FFD700' },
    { id: 3, nome: 'Novo Notebook', valorObjetivo: 5000, valorAtual: 4100, cor: '#FF6B6B' },
  ];

  const gastosPorCategoria = {
    labels: ['Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Outros'],
    datasets: [{
      data: [850, 420, 1200, 380, 490],
      backgroundColor: ['#FF6B6B', '#4ECDC4', '#95E1D3', '#FCBAD3', '#FDCB9E'],
    }],
  };

  const historicoSaldo = {
    labels: ['Jan 15', 'Jan 20', 'Jan 25', 'Jan 30'],
    datasets: [{
      label: 'Saldo',
      data: [4200, 4800, 4500, 5000],
      borderColor: '#1976d2',
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
      tension: 0.4,
    }],
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Cabeçalho Moderno */}
      <Fade in timeout={800}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight={700} sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {t('dashboard.welcome')}, Israel! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              📅 {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </Box>
          <IconButton 
            sx={{ 
              bgcolor: 'white', 
              boxShadow: 2,
              '&:hover': { bgcolor: '#f5f5f5', transform: 'scale(1.05)' },
              transition: 'all 0.3s'
            }}
          >
            <Notifications color="primary" />
          </IconButton>
        </Box>
      </Fade>

      <Grid container spacing={3}>
        {/* Cards de Resumo com Animação */}
        <Grid item xs={12} md={4}>
          <Grow in timeout={1000}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.5)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalanceWallet sx={{ fontSize: 28 }} />
                    <Typography variant="h6" fontWeight={600}>Saldo Disponível</Typography>
                  </Box>
                  <IconButton onClick={() => setShowBalance(!showBalance)} sx={{ color: 'white' }}>
                    {showBalance ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </Box>
                <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
                  {showBalance ? formatarMoeda(saldoTotal) : '••••••'}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  borderRadius: 2,
                  px: 2,
                  py: 1
                }}>
                  <TrendingUp sx={{ mr: 1 }} />
                  <Typography variant="body2" fontWeight={600}>+12.5% este mês</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grow in timeout={1200}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
              color: 'white',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(240, 147, 251, 0.4)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(240, 147, 251, 0.5)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CreditCard sx={{ fontSize: 28 }} />
                  <Typography variant="h6" fontWeight={600}>Crédito Disponível</Typography>
                </Box>
                <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
                  {formatarMoeda(limiteCredito)}
                </Typography>
                <Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={35} 
                    sx={{ 
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(255,255,255,0.3)', 
                      '& .MuiLinearProgress-bar': { 
                        bgcolor: 'white',
                        borderRadius: 4
                      } 
                    }}
                  />
                  <Typography variant="body2" sx={{ mt: 1.5, fontWeight: 600 }}>
                    💳 35% utilizado
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grow in timeout={1400}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
              color: 'white',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(79, 172, 254, 0.4)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(79, 172, 254, 0.5)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingDown sx={{ fontSize: 28 }} />
                    <Typography variant="h6" fontWeight={600}>Gastos do Mês</Typography>
                  </Box>
                </Box>
                <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
                  {formatarMoeda(gastosDoMes)}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  borderRadius: 2,
                  px: 2,
                  py: 1
                }}>
                  <Typography variant="body2" fontWeight={600}>
                    📉 -8.3% vs mês anterior
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        {/* Ações Rápidas */}
        <Grid item xs={12}>
          <Zoom in timeout={1600}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              background: 'white'
            }}>
              <Typography variant="h6" gutterBottom fontWeight={700} sx={{ mb: 3 }}>
                ⚡ Ações Rápidas
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<SwapHoriz />}
                    sx={{ 
                      py: 2.5, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                      fontWeight: 600,
                      fontSize: '1rem',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 6px 24px rgba(102, 126, 234, 0.4)',
                      }
                    }}
                  >
                    PIX
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Payment />}
                    sx={{ 
                      py: 2.5, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      boxShadow: '0 4px 16px rgba(240, 147, 251, 0.3)',
                      fontWeight: 600,
                      fontSize: '1rem',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 6px 24px rgba(240, 147, 251, 0.4)',
                      }
                    }}
                  >
                    Pagar Conta
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    variant="contained"
                    fullWidth
                  startIcon={<CreditCard />}
                  sx={{ py: 2, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}
                >
                  Meus Cartões
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Add />}
                  sx={{ py: 2, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}
                >
                  Investir
                </Button>
              </Grid>
            </Grid>
          </Paper>
          </Zoom>
        </Grid>

        {/* Gráficos */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Histórico de Saldo
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line 
                data={historicoSaldo} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } }
                }} 
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Gastos por Categoria
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie 
                data={gastosPorCategoria} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } }
                }} 
              />
            </Box>
          </Paper>
        </Grid>

        {/* Metas Financeiras */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Metas Financeiras
            </Typography>
            {metasFinanceiras.map((meta) => {
              const progresso = (meta.valorAtual / meta.valorObjetivo) * 100;
              return (
                <Box key={meta.id} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" fontWeight={500}>{meta.nome}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {progresso.toFixed(0)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={progresso} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': { bgcolor: meta.cor }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {formatarMoeda(meta.valorAtual)} de {formatarMoeda(meta.valorObjetivo)}
                  </Typography>
                </Box>
              );
            })}
          </Paper>
        </Grid>

        {/* Transações Recentes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Transações Recentes
            </Typography>
            {transacoesRecentes.map((transacao) => (
              <Box 
                key={transacao.id} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  py: 2,
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                  '&:last-child': { borderBottom: 'none' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ 
                    bgcolor: transacao.valor > 0 ? '#4caf50' : '#f44336',
                    mr: 2 
                  }}>
                    {transacao.valor > 0 ? <TrendingUp /> : <TrendingDown />}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {transacao.descricao}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(transacao.data).toLocaleDateString('pt-BR')}
                    </Typography>
                  </Box>
                </Box>
                <Typography 
                  variant="body1" 
                  fontWeight={600}
                  color={transacao.valor > 0 ? 'success.main' : 'error.main'}
                >
                  {transacao.valor > 0 ? '+' : ''}{formatarMoeda(transacao.valor)}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
