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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Slider,
  FormControlLabel,
  Divider,
  TextField,
} from '@mui/material';
import { CreditCard, Block, Lock, Add, Visibility, Settings, ContactlessOutlined } from '@mui/icons-material';

export default function Cards() {
  const [showNumbers, setShowNumbers] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'bloquear' | 'desbloquear' | 'configurar' | 'solicitar'>('bloquear');
  const [cartaoSelecionado, setCartaoSelecionado] = useState<number | null>(null);
  
  // Estados para configurações do cartão
  const [limiteCredito, setLimiteCredito] = useState(10000);
  const [notificacoes, setNotificacoes] = useState({
    compras: true,
    pagamentos: true,
    saques: false,
  });
  const [comprasInternacionais, setComprasInternacionais] = useState(true);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [cartoes, setCartoes] = useState([
    {
      id: 1,
      tipo: 'Crédito',
      numero: '**** **** **** 1234',
      numeroCompleto: '4532 1234 5678 1234',
      nome: 'ADMIN SISTEMA',
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
      nome: 'ADMIN SISTEMA',
      bandeira: 'Mastercard',
      vencimento: '06/27',
      cvv: '456',
      bloqueado: false,
      cor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
  ]);

  const handleToggleBloqueio = (id: number) => {
    const cartao = cartoes.find(c => c.id === id);
    if (cartao) {
      setCartaoSelecionado(id);
      setDialogType(cartao.bloqueado ? 'desbloquear' : 'bloquear');
      setOpenDialog(true);
    }
  };

  const confirmarBloqueio = () => {
    if (cartaoSelecionado) {
      setCartoes(cartoes.map(c => 
        c.id === cartaoSelecionado 
          ? { ...c, bloqueado: !c.bloqueado }
          : c
      ));
    }
    setOpenDialog(false);
  };

  const handleConfigurar = (id: number) => {
    setCartaoSelecionado(id);
    setDialogType('configurar');
    setOpenDialog(true);
  };

  const handleSolicitarCartao = () => {
    setDialogType('solicitar');
    setOpenDialog(true);
  };

  const handleSalvarConfiguracoes = () => {
    // Aqui você pode adicionar lógica para salvar no backend
    console.log('Configurações salvas:', {
      limiteCredito,
      notificacoes,
      comprasInternacionais,
    });
    setOpenDialog(false);
  };

  const handleAlterarSenha = () => {
    if (novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }
    if (novaSenha.length < 4) {
      alert('A senha deve ter no mínimo 4 dígitos!');
      return;
    }
    console.log('Senha alterada com sucesso');
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarSenha('');
    alert('Senha alterada com sucesso!');
  };

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
            onClick={handleSolicitarCartao}
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
                      bgcolor: cartao.bloqueado ? '#ffebee' : '#e8f5e9',
                      borderRadius: 2,
                      border: `2px solid ${cartao.bloqueado ? '#ef5350' : '#66bb6a'}`
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Lock color={cartao.bloqueado ? 'error' : 'success'} />
                        <Typography fontWeight={600}>
                          {cartao.bloqueado ? 'Cartão Bloqueado' : 'Cartão Ativo'}
                        </Typography>
                      </Box>
                      <Switch 
                        checked={cartao.bloqueado} 
                        onChange={() => handleToggleBloqueio(cartao.id)}
                        color={cartao.bloqueado ? 'error' : 'success'}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Settings />}
                      onClick={() => handleConfigurar(cartao.id)}
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
                      onClick={() => handleToggleBloqueio(cartao.id)}
                      color={cartao.bloqueado ? 'success' : 'error'}
                      sx={{ 
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 600
                      }}
                    >
                      {cartao.bloqueado ? 'Desbloquear' : 'Bloquear'}
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Fade>
          </Grid>
))}
      </Grid>

      {/* Dialog de Confirmação */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogTitle>
          {dialogType === 'bloquear' && '🔒 Bloquear Cartão'}
          {dialogType === 'desbloquear' && '✅ Desbloquear Cartão'}
          {dialogType === 'configurar' && '⚙️ Configurações do Cartão'}
          {dialogType === 'solicitar' && '📝 Solicitar Novo Cartão'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'bloquear' && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Ao bloquear o cartão, todas as transações serão recusadas até que você desbloqueie novamente.
              </Typography>
            </Alert>
          )}
          {dialogType === 'desbloquear' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Deseja desbloquear este cartão? Ele voltará a funcionar normalmente.
              </Typography>
            </Alert>
          )}
          {dialogType === 'configurar' && (
            <Box sx={{ py: 2 }}>
              {/* Limite de Crédito */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  💳 Limite de Crédito
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Ajuste o limite do seu cartão de crédito
                </Typography>
                <Box sx={{ px: 2, mt: 3 }}>
                  <Slider
                    value={limiteCredito}
                    onChange={(e, newValue) => setLimiteCredito(newValue as number)}
                    min={1000}
                    max={50000}
                    step={500}
                    marks={[
                      { value: 1000, label: 'R$ 1k' },
                      { value: 25000, label: 'R$ 25k' },
                      { value: 50000, label: 'R$ 50k' },
                    ]}
                    valueLabelDisplay="on"
                    valueLabelFormat={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                </Box>
                <Typography variant="h6" color="primary" sx={{ mt: 2, textAlign: 'center' }}>
                  R$ {limiteCredito.toLocaleString('pt-BR')}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Notificações */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  🔔 Notificações
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                  Escolha quais notificações deseja receber
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificacoes.compras}
                      onChange={(e) => setNotificacoes({ ...notificacoes, compras: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Notificar compras realizadas"
                  sx={{ display: 'flex', mb: 1 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificacoes.pagamentos}
                      onChange={(e) => setNotificacoes({ ...notificacoes, pagamentos: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Notificar vencimento de faturas"
                  sx={{ display: 'flex', mb: 1 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificacoes.saques}
                      onChange={(e) => setNotificacoes({ ...notificacoes, saques: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Notificar saques em caixas eletrônicos"
                  sx={{ display: 'flex' }}
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Compras Internacionais */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  🌍 Compras Internacionais
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                  Habilite ou desabilite compras no exterior
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 2,
                  bgcolor: comprasInternacionais ? '#e8f5e9' : '#ffebee',
                  borderRadius: 2,
                  border: `2px solid ${comprasInternacionais ? '#66bb6a' : '#ef5350'}`
                }}>
                  <Box>
                    <Typography fontWeight={600}>
                      {comprasInternacionais ? 'Compras Habilitadas' : 'Compras Bloqueadas'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {comprasInternacionais ? 'Você pode fazer compras no exterior' : 'Compras internacionais bloqueadas'}
                    </Typography>
                  </Box>
                  <Switch 
                    checked={comprasInternacionais}
                    onChange={(e) => setComprasInternacionais(e.target.checked)}
                    color={comprasInternacionais ? 'success' : 'error'}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Senha do Cartão */}
              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  🔐 Gerenciar Senha
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                  Altere a senha do seu cartão
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  label="Senha Atual"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  type="password"
                  label="Nova Senha (4 dígitos)"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  inputProps={{ maxLength: 4 }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  type="password"
                  label="Confirmar Nova Senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  inputProps={{ maxLength: 4 }}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleAlterarSenha}
                  disabled={!senhaAtual || !novaSenha || !confirmarSenha}
                  sx={{ mt: 1 }}
                >
                  Alterar Senha
                </Button>
              </Box>
            </Box>
          )}
          {dialogType === 'solicitar' && (
            <Box sx={{ py: 2 }}>
              <Typography variant="body1" gutterBottom>
                Tipos de cartão disponíveis:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                • Cartão de Crédito (Visa/Mastercard)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                • Cartão de Débito
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                • Cartão Virtual
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                Entre em contato com nosso atendimento para solicitar um novo cartão.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          {(dialogType === 'bloquear' || dialogType === 'desbloquear') && (
            <Button variant="contained" onClick={confirmarBloqueio} color={dialogType === 'bloquear' ? 'error' : 'success'}>
              Confirmar
            </Button>
          )}
          {dialogType === 'configurar' && (
            <Button variant="contained" onClick={handleSalvarConfiguracoes}>
              Salvar Configurações
            </Button>
          )}
          {dialogType === 'solicitar' && (
            <Button variant="contained" onClick={() => setOpenDialog(false)}>
              Fechar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
