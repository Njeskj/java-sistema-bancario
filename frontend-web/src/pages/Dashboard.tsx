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
  CircularProgress,
  Alert,
  AlertTitle,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
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
  Download,
  PictureAsPdf,
  TableChart,
  Description,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
import api from '../services/api';
import { exportToPDF, exportToExcel, exportToCSV } from '../utils/exportUtils';
import { useToast } from '../components/Toast';

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

interface Transacao {
  id: number;
  tipoTransacao: string;
  valor: number;
  descricao: string;
  dataTransacao: string;
  status: string;
}

interface Conta {
  id: number;
  banco: string;
  numeroConta: string;
  saldoBrl: number;
  saldoEur: number;
  saldoUsd: number;
  moedaPrincipal: string;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showBalance, setShowBalance] = useState(true);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [conta, setConta] = useState<Conta | null>(null);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [limiteCredito, setLimiteCredito] = useState(10000.00);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [gastosDoMes, setGastosDoMes] = useState(0);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [gastosPorCategoria, setGastosPorCategoria] = useState<any>({
    labels: ['Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Outros'],
    datasets: [{
      data: [0, 0, 0, 0, 0],
      backgroundColor: ['#FF6B6B', '#4ECDC4', '#95E1D3', '#FCBAD3', '#FDCB9E'],
    }],
  });
  const [historicoSaldo, setHistoricoSaldo] = useState<any>({
    labels: [],
    datasets: [{
      label: 'Saldo',
      data: [],
      borderColor: '#1976d2',
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
      tension: 0.4,
    }],
  });
  const [metasFinanceiras, setMetasFinanceiras] = useState<any[]>([]);

  useEffect(() => {
    carregarDadosDashboard();
  }, []);

  const carregarDadosDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const usuarioId = localStorage.getItem('usuarioId');
      const nomeCompleto = localStorage.getItem('nomeCompleto');

      // Verificar se os dados estão no formato correto
      if (!token || !usuarioId || usuarioId === 'undefined' || usuarioId === 'null') {
        console.warn('Dados de login inválidos ou no formato antigo - limpando localStorage');
        localStorage.clear();
        navigate('/login');
        return;
      }

      setNomeUsuario(nomeCompleto || 'Usuário');

      // Buscar contas do usuário
      const contasResponse = await api.get(`/contas/usuario/${usuarioId}`);
      const contasData = contasResponse.data;
      
      if (contasData && contasData.length > 0) {
        const primeiraConta = contasData[0];
        setConta(primeiraConta);
        setSaldoTotal(primeiraConta.saldoBrl || 0);

        // Buscar transações da conta
        try {
          const transacoesResponse = await api.get(`/contas/${primeiraConta.id}/extrato`);
          const transacoesData = transacoesResponse.data;
          setTransacoes(transacoesData.slice(0, 5)); // Últimas 5 transações

          // Calcular gastos do mês
          const mesAtual = new Date().getMonth();
          const gastos = transacoesData
            .filter((t: Transacao) => {
              const dataTransacao = new Date(t.dataTransacao);
              return dataTransacao.getMonth() === mesAtual && t.valor < 0;
            })
            .reduce((total: number, t: Transacao) => total + Math.abs(t.valor), 0);
          
          setGastosDoMes(gastos);

          // Calcular gastos por categoria (baseado em tipo de transação)
          const categorias = {
            'Alimentação': 0,
            'Transporte': 0,
            'Moradia': 0,
            'Lazer': 0,
            'Outros': 0
          };

          transacoesData.forEach((t: Transacao) => {
            if (t.valor < 0) {
              const valor = Math.abs(t.valor);
              const descricao = t.descricao?.toLowerCase() || '';
              const tipo = t.tipoTransacao?.toLowerCase() || '';

              if (descricao.includes('super') || descricao.includes('mercado') || descricao.includes('restaurante')) {
                categorias['Alimentação'] += valor;
              } else if (descricao.includes('uber') || descricao.includes('taxi') || descricao.includes('transporte') || tipo.includes('transfer')) {
                categorias['Transporte'] += valor;
              } else if (descricao.includes('luz') || descricao.includes('agua') || descricao.includes('aluguel') || descricao.includes('conta')) {
                categorias['Moradia'] += valor;
              } else if (descricao.includes('cinema') || descricao.includes('lazer') || descricao.includes('streaming')) {
                categorias['Lazer'] += valor;
              } else {
                categorias['Outros'] += valor;
              }
            }
          });

          setGastosPorCategoria({
            labels: Object.keys(categorias),
            datasets: [{
              data: Object.values(categorias),
              backgroundColor: ['#FF6B6B', '#4ECDC4', '#95E1D3', '#FCBAD3', '#FDCB9E'],
            }],
          });

          // Calcular histórico de saldo (últimos 30 dias)
          const hoje = new Date();
          const transacoesOrdenadas = [...transacoesData].sort((a, b) => 
            new Date(a.dataTransacao).getTime() - new Date(b.dataTransacao).getTime()
          );

          let saldoAtual = primeiraConta.saldoBrl || 0;
          const historico: { data: string; saldo: number }[] = [];

          // Calcular saldo inicial (30 dias atrás)
          const trintaDiasAtras = new Date(hoje);
          trintaDiasAtras.setDate(hoje.getDate() - 30);

          transacoesOrdenadas.forEach(t => {
            const dataTransacao = new Date(t.dataTransacao);
            if (dataTransacao >= trintaDiasAtras) {
              historico.push({
                data: dataTransacao.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
                saldo: saldoAtual
              });
            }
            // Como temos saldo atual, recalculamos retroativamente
            saldoAtual -= t.valor;
          });

          // Inverter para ter ordem cronológica crescente
          historico.reverse();
          
          // Adicionar saldo atual
          historico.push({
            data: hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
            saldo: primeiraConta.saldoBrl || 0
          });

          // Pegar apenas últimos 7 pontos para melhor visualização
          const historicoLimitado = historico.slice(-7);

          setHistoricoSaldo({
            labels: historicoLimitado.map(h => h.data),
            datasets: [{
              label: 'Saldo',
              data: historicoLimitado.map(h => h.saldo),
              borderColor: '#1976d2',
              backgroundColor: 'rgba(25, 118, 210, 0.1)',
              tension: 0.4,
            }],
          });

          // Criar metas financeiras baseadas no saldo atual
          const saldo = primeiraConta.saldoBrl || 0;
          setMetasFinanceiras([
            { 
              id: 1, 
              nome: 'Reserva de Emergência', 
              valorObjetivo: saldo * 2, 
              valorAtual: saldo * 0.6, 
              cor: '#FFD700' 
            },
            { 
              id: 2, 
              nome: 'Investimento Futuro', 
              valorObjetivo: 15000, 
              valorAtual: saldo * 0.3, 
              cor: '#4ECDC4' 
            },
            { 
              id: 3, 
              nome: 'Fundo de Viagem', 
              valorObjetivo: 8000, 
              valorAtual: saldo * 0.2, 
              cor: '#FF6B6B' 
            },
          ]);

        } catch (error) {
          // Erro de transações - silencioso
        }
      }
    } catch (error: any) {
      // Erro capturado - mensagem exibida ao usuário via Alert
      
      if (error.response?.status === 500) {
        setErro('Erro no servidor. Por favor, verifique se o backend está funcionando corretamente.');
      } else if (error.response?.status === 403 || error.response?.status === 401) {
        setErro('Sessão expirada. Por favor, faça login novamente.');
        setTimeout(() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }, 2000);
      } else if (error.code === 'ERR_NETWORK') {
        setErro('Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        setErro('Erro ao carregar dados. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Cabeçalho Moderno */}      {/* Exibição de erro */}
      {erro && (
        <Fade in>
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setErro(null)}
          >
            <AlertTitle>Erro ao Carregar Dashboard</AlertTitle>
            {erro}
          </Alert>
        </Fade>
      )}
      <Fade in timeout={800}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight={700} sx={{ 
              background: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {t('Bem vindo')}, {nomeUsuario}! 👋
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
              background: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)', 
              color: 'white',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(33, 150, 243, 0.4)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(33, 150, 243, 0.5)',
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
              background: 'linear-gradient(135deg, #42A5F5 0%, #2196F3 100%)', 
              color: 'white',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(66, 165, 245, 0.4)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(66, 165, 245, 0.5)',
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
              background: 'linear-gradient(135deg, #64B5F6 0%, #42A5F5 100%)', 
              color: 'white',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(100, 181, 246, 0.4)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(100, 181, 246, 0.5)',
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
                    onClick={() => navigate('/payments')}
                    startIcon={<SwapHoriz />}
                    sx={{ 
                      py: 2.5, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                      boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
                      fontWeight: 600,
                      fontSize: '1rem',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 6px 24px rgba(25, 118, 210, 0.4)',
                      }
                    }}
                  >
                    PIX
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/payments')}
                    fullWidth
                    startIcon={<Payment />}
                    sx={{ 
                      py: 2.5, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #42A5F5 0%, #2196F3 100%)',
                      boxShadow: '0 4px 16px rgba(66, 165, 245, 0.3)',
                      fontWeight: 600,
                      fontSize: '1rem',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 6px 24px rgba(66, 165, 245, 0.4)',
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
                    onClick={() => navigate('/cards')}
                    sx={{ 
                      py: 2.5, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #64B5F6 0%, #42A5F5 100%)',
                      boxShadow: '0 4px 16px rgba(100, 181, 246, 0.3)',
                      fontWeight: 600,
                      fontSize: '1rem',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 6px 24px rgba(100, 181, 246, 0.4)',
                      }
                    }}
                  >
                    Meus Cartões
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Add />}
                    onClick={() => navigate('/investments')}
                    sx={{ 
                      py: 2.5, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #90CAF9 0%, #64B5F6 100%)',
                      boxShadow: '0 4px 16px rgba(144, 202, 249, 0.3)',
                      fontWeight: 600,
                      fontSize: '1rem',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 6px 24px rgba(144, 202, 249, 0.4)',
                      }
                    }}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Transações Recentes
              </Typography>
              <Button
                size="small"
                startIcon={<Download />}
                onClick={(e) => setExportMenuAnchor(e.currentTarget)}
                data-testid="btn-export"
              >
                Exportar
              </Button>
              <Menu
                anchorEl={exportMenuAnchor}
                open={Boolean(exportMenuAnchor)}
                onClose={() => setExportMenuAnchor(null)}
              >
                <MenuItem onClick={() => {
                  const userName = localStorage.getItem('nomeCompleto') || 'Cliente';
                  exportToPDF(transacoes.map(t => ({
                    id: t.id,
                    tipo: t.tipoTransacao,
                    valor: t.valor,
                    data: t.dataTransacao,
                    descricao: t.descricao,
                    status: t.status
                  })), userName);
                  showToast('Extrato PDF gerado com sucesso!', 'success');
                  setExportMenuAnchor(null);
                }}>
                  <ListItemIcon><PictureAsPdf fontSize="small" /></ListItemIcon>
                  <ListItemText>Exportar PDF</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {
                  const userName = localStorage.getItem('nomeCompleto') || 'Cliente';
                  exportToExcel(transacoes.map(t => ({
                    id: t.id,
                    tipo: t.tipoTransacao,
                    valor: t.valor,
                    data: t.dataTransacao,
                    descricao: t.descricao,
                    status: t.status
                  })), userName);
                  showToast('Extrato Excel gerado com sucesso!', 'success');
                  setExportMenuAnchor(null);
                }}>
                  <ListItemIcon><TableChart fontSize="small" /></ListItemIcon>
                  <ListItemText>Exportar Excel</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {
                  exportToCSV(transacoes.map(t => ({
                    id: t.id,
                    tipo: t.tipoTransacao,
                    valor: t.valor,
                    data: t.dataTransacao,
                    descricao: t.descricao,
                    status: t.status
                  })));
                  showToast('Extrato CSV gerado com sucesso!', 'success');
                  setExportMenuAnchor(null);
                }}>
                  <ListItemIcon><Description fontSize="small" /></ListItemIcon>
                  <ListItemText>Exportar CSV</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
            {transacoes.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                Nenhuma transação encontrada
              </Typography>
            ) : (
              transacoes.map((transacao) => (
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
                        {new Date(transacao.dataTransacao).toLocaleDateString('pt-BR')} - {transacao.tipoTransacao}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography 
                    variant="body1" 
                    fontWeight={600}
                    color={transacao.valor > 0 ? 'success.main' : 'error.main'}
                  >
                    {transacao.valor > 0 ? '+' : ''}{formatarMoeda(Math.abs(transacao.valor))}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
