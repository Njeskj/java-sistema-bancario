import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Chip,
  Paper,
  Avatar
} from '@mui/material';
import {
  AccountBalance,
  Security,
  Speed,
  PhoneAndroid,
  CreditCard,
  TrendingUp,
  Language,
  Support,
  CheckCircle,
  ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Segurança Máxima',
      description: 'Proteção de dados com criptografia de ponta e autenticação em dois fatores'
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Transações Instantâneas',
      description: 'PIX, TED e DOC com processamento em tempo real 24/7'
    },
    {
      icon: <PhoneAndroid sx={{ fontSize: 40 }} />,
      title: 'App Mobile',
      description: 'Gerencie suas finanças de qualquer lugar com nosso app intuitivo'
    },
    {
      icon: <CreditCard sx={{ fontSize: 40 }} />,
      title: 'Cartões Sem Anuidade',
      description: 'Cartão de crédito internacional com cashback e sem taxas escondidas'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Investimentos',
      description: 'Acesse fundos, CDB, LCI e LCA com rentabilidade acima da poupança'
    },
    {
      icon: <Support sx={{ fontSize: 40 }} />,
      title: 'Suporte 24h',
      description: 'Atendimento humanizado disponível todos os dias, a qualquer hora'
    }
  ];

  const benefits = [
    'Conta digital 100% gratuita',
    'Sem taxa de manutenção',
    'Abertura de conta em 5 minutos',
    'Cartão de débito internacional',
    'Programa de cashback',
    'Investimentos a partir de R$ 1'
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'grey.200' }}>
        <Toolbar>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ flexGrow: 1, fontWeight: 700, color: 'primary.main' }}
          >
            💳 IBank
          </Typography>
          <Button 
            color="primary" 
            onClick={() => navigate('/login')}
            sx={{ mr: 1 }}
            data-testid="btn-header-login"
          >
            Entrar
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/register')}
            data-testid="btn-header-register"
          >
            Abrir Conta
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip 
                label="🎉 Novo: Cashback de até 5%" 
                color="primary" 
                sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Typography 
                variant={isMobile ? 'h3' : 'h2'} 
                fontWeight={700} 
                gutterBottom
                data-testid="hero-title"
              >
                O banco digital que simplifica sua vida
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
                Conta gratuita, sem burocracia e com tudo que você precisa para cuidar do seu dinheiro.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    px: 4,
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                  endIcon={<ArrowForward />}
                  data-testid="btn-hero-register"
                >
                  Abrir Conta Grátis
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    borderColor: 'white', 
                    color: 'white',
                    px: 4,
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                  data-testid="btn-hero-login"
                >
                  Já Sou Cliente
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative'
                }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.95)',
                    maxWidth: 400
                  }}
                >
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'primary.main',
                        margin: '0 auto',
                        mb: 2
                      }}
                    >
                      <AccountBalance sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h6" color="text.primary" fontWeight={600}>
                      Conta Digital Completa
                    </Typography>
                  </Box>
                  <Box sx={{ color: 'text.secondary' }}>
                    {benefits.slice(0, 4).map((benefit, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <CheckCircle sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">{benefit}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Por que escolher o IBank?
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Tudo que você precisa em um único lugar
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'grey.200',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'primary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 2,
                      color: 'primary.main'
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                Benefícios Exclusivos
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                Aproveite todas as vantagens de ser cliente IBank
              </Typography>
              <Grid container spacing={2}>
                {benefits.map((benefit, index) => (
                  <Grid item xs={12} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle sx={{ mr: 2, fontSize: 28 }} />
                      <Typography variant="body1" fontWeight={500}>
                        {benefit}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={8}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  textAlign: 'center'
                }}
              >
                <Language sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" fontWeight={600} gutterBottom color="text.primary">
                  Disponível em 4 idiomas
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Português (BR/PT), English e Español
                </Typography>
                <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
                  3 moedas
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Real (BRL), Dólar (USD) e Euro (EUR)
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper
          elevation={4}
          sx={{
            p: 6,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Pronto para começar?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
            Abra sua conta em menos de 5 minutos. É rápido, fácil e 100% digital.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/register')}
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main',
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              '&:hover': { bgcolor: 'grey.100' }
            }}
            endIcon={<ArrowForward />}
            data-testid="btn-cta-register"
          >
            Abrir Minha Conta Grátis
          </Button>
        </Paper>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                💳 IBank
              </Typography>
              <Typography variant="body2" color="grey.400">
                O banco digital completo para você gerenciar suas finanças com segurança e praticidade.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Links Rápidos
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.light' } }}>
                  Sobre Nós
                </Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.light' } }}>
                  Segurança
                </Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.light' } }}>
                  Ajuda
                </Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.light' } }}>
                  Contato
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Atendimento 24h
              </Typography>
              <Typography variant="body2" color="grey.400">
                📞 0800 123 4567
              </Typography>
              <Typography variant="body2" color="grey.400">
                📧 contato@ibank.com.br
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: '1px solid', borderColor: 'grey.800', mt: 4, pt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="grey.500">
              © 2026 IBank. Todos os direitos reservados.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
