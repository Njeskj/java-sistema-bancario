import React, { useState, useEffect } from 'react';
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
  Alert,
  Switch,
  FormControlLabel,
  Slider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  MenuItem,
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
  Settings,
  Delete,
  CheckCircle,
  CameraAlt,
  Image,
  Download,
} from '@mui/icons-material';

export default function Transactions() {
  const [tabValue, setTabValue] = useState(0);
  
  // Estados para filtros
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');
  const [filtroValorMin, setFiltroValorMin] = useState('');
  const [filtroValorMax, setFiltroValorMax] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
  const [openPix, setOpenPix] = useState(false);
  const [openConfigPix, setOpenConfigPix] = useState(false);
  const [openAddChave, setOpenAddChave] = useState(false);
  const [openQrCodePix, setOpenQrCodePix] = useState(false);
  const [qrCodeMode, setQrCodeMode] = useState<'ler' | 'gerar'>('ler');
  const [qrCodeGerado, setQrCodeGerado] = useState('');
  const [valorQrCode, setValorQrCode] = useState('');
  const [descricaoQrCode, setDescricaoQrCode] = useState('');
  const [cameraAberta, setCameraAberta] = useState(false);
  
  // Estados para câmbio internacional
  const [exchangeRates, setExchangeRates] = useState<any>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [moedaSelecionada, setMoedaSelecionada] = useState('USD');
  const [valorInternacional, setValorInternacional] = useState('');
  
  // Estados para Transferência
  const [bancoTransferencia, setBancoTransferencia] = useState('001');
  
  // Estados para TED/DOC
  const [tipoTedDoc, setTipoTedDoc] = useState('TED');
  const [bancoTedDoc, setBancoTedDoc] = useState('001');
  const [finalidadeTedDoc, setFinalidadeTedDoc] = useState('01');
  
  // Estados para Internacional
  const [paisDestino, setPaisDestino] = useState('US');
  const [motivoInternacional, setMotivoInternacional] = useState('01');
  
  // Estados para Configurações PIX
  const [limiteDiario, setLimiteDiario] = useState(5000);
  const [limiteNoturno, setLimiteNoturno] = useState(1000);
  const [notificacoesPix, setNotificacoesPix] = useState({
    recebimento: true,
    envio: true,
    chaveCadastrada: true,
  });
  const [tipoChaveNova, setTipoChaveNova] = useState('CPF');
  const [valorChaveNova, setValorChaveNova] = useState('');

  // Estados para Configurações de Transferência
  const [openConfigTransf, setOpenConfigTransf] = useState(false);
  const [openAddFavorecido, setOpenAddFavorecido] = useState(false);
  const [limiteTransferencia, setLimiteTransferencia] = useState(10000);
  const [notificacoesTransf, setNotificacoesTransf] = useState({
    envio: true,
    agendamento: true,
  });
  const [favorecidos, setFavorecidos] = useState([
    { id: 1, nome: 'João Silva', banco: '001', agencia: '0001', conta: '12345-6' },
    { id: 2, nome: 'Maria Santos', banco: '237', agencia: '0234', conta: '98765-4' },
  ]);
  const [novoFavorecido, setNovoFavorecido] = useState({
    nome: '',
    banco: '001',
    agencia: '',
    conta: '',
  });

  // Estados para Configurações TED/DOC
  const [openConfigTed, setOpenConfigTed] = useState(false);
  const [openAddBeneficiarioTed, setOpenAddBeneficiarioTed] = useState(false);
  const [limiteTed, setLimiteTed] = useState(15000);
  const [limiteDoc, setLimiteDoc] = useState(10000);
  const [permitirAgendamento, setPermitirAgendamento] = useState(true);
  const [notificacoesTed, setNotificacoesTed] = useState({
    envio: true,
    confirmacao: true,
    agendamento: true,
  });
  const [beneficiariosTed, setBeneficiariosTed] = useState([
    { id: 1, nome: 'Carlos Oliveira', banco: '341', agencia: '1234', conta: '56789-0', cpf: '123.456.789-00' },
  ]);
  const [novoBeneficiarioTed, setNovoBeneficiarioTed] = useState({
    nome: '',
    banco: '001',
    agencia: '',
    conta: '',
    cpf: '',
  });

  // Estados para Configurações Internacional
  const [openConfigInt, setOpenConfigInt] = useState(false);
  const [openAddBeneficiarioInt, setOpenAddBeneficiarioInt] = useState(false);
  const [limiteInternacional, setLimiteInternacional] = useState(3000);
  const [paisesPermitidos, setPaisesPermitidos] = useState({
    US: true,
    GB: true,
    PT: true,
    ES: true,
    FR: false,
    DE: false,
  });
  const [notificacoesInt, setNotificacoesInt] = useState({
    envio: true,
    confirmacao: true,
    cambio: true,
  });
  const [beneficiariosInt, setBeneficiariosInt] = useState([
    { id: 1, nome: 'John Smith', pais: 'US', swift: 'ABCDUS33XXX', iban: 'US1234567890' },
  ]);
  const [novoBeneficiarioInt, setNovoBeneficiarioInt] = useState({
    nome: '',
    pais: 'US',
    swift: '',
    iban: '',
  });

  const [chavesPix, setChavesPix] = useState([
    { id: 1, tipo: 'CPF', chave: '000.000.000-00', principal: true },
    { id: 2, tipo: 'Email', chave: 'admin@ibank.com', principal: false },
    { id: 3, tipo: 'Telefone', chave: '+55 11 98765-4321', principal: false },
  ]);

  // Buscar taxas de câmbio quando a aba internacional for aberta
  useEffect(() => {
    if (tabValue === 3 && !exchangeRates) {
      fetchExchangeRates();
    }
  }, [tabValue]);

  const fetchExchangeRates = async () => {
    setLoadingRates(true);
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/BRL');
      const data = await response.json();
      setExchangeRates(data.rates);
    } catch (error) {
      console.error('Erro ao buscar taxas de câmbio:', error);
    } finally {
      setLoadingRates(false);
    }
  };

  // Calcular conversão em tempo real
  const calcularConversao = () => {
    if (!exchangeRates || !valorInternacional) return { taxa: 0, total: 0, totalBRL: 0 };
    
    const valor = parseFloat(valorInternacional);
    const taxaCambio = 1 / exchangeRates[moedaSelecionada]; // De BRL para moeda estrangeira
    const total = valor; // Valor na moeda estrangeira
    const totalBRL = valor * taxaCambio; // Valor em BRL
    
    return { taxa: taxaCambio, total, totalBRL };
  };

  // Funções para gerenciar chaves PIX
  const handleAddChave = () => {
    if (!valorChaveNova) return;
    
    const novaChave = {
      id: chavesPix.length + 1,
      tipo: tipoChaveNova,
      chave: valorChaveNova,
      principal: chavesPix.length === 0,
    };
    
    setChavesPix([...chavesPix, novaChave]);
    setValorChaveNova('');
    setOpenAddChave(false);
  };

  const handleDeleteChave = (id: number) => {
    setChavesPix(chavesPix.filter(c => c.id !== id));
  };

  const handleSetPrincipal = (id: number) => {
    setChavesPix(chavesPix.map(c => ({
      ...c,
      principal: c.id === id
    })));
  };

  const handleSalvarConfigPix = () => {
    console.log('Configurações PIX salvas:', {
      limiteDiario,
      limiteNoturno,
      notificacoesPix,
    });
    setOpenConfigPix(false);
  };

  // Funções para Transferência
  const handleAddFavorecido = () => {
    if (!novoFavorecido.nome || !novoFavorecido.agencia || !novoFavorecido.conta) return;
    
    setFavorecidos([...favorecidos, {
      id: favorecidos.length + 1,
      ...novoFavorecido,
    }]);
    setNovoFavorecido({ nome: '', banco: '001', agencia: '', conta: '' });
    setOpenAddFavorecido(false);
  };

  const handleDeleteFavorecido = (id: number) => {
    setFavorecidos(favorecidos.filter(f => f.id !== id));
  };

  const handleSalvarConfigTransf = () => {
    console.log('Configurações de Transferência salvas');
    setOpenConfigTransf(false);
  };

  // Funções para TED/DOC
  const handleAddBeneficiarioTed = () => {
    if (!novoBeneficiarioTed.nome || !novoBeneficiarioTed.agencia || !novoBeneficiarioTed.conta) return;
    
    setBeneficiariosTed([...beneficiariosTed, {
      id: beneficiariosTed.length + 1,
      ...novoBeneficiarioTed,
    }]);
    setNovoBeneficiarioTed({ nome: '', banco: '001', agencia: '', conta: '', cpf: '' });
    setOpenAddBeneficiarioTed(false);
  };

  const handleDeleteBeneficiarioTed = (id: number) => {
    setBeneficiariosTed(beneficiariosTed.filter(b => b.id !== id));
  };

  const handleSalvarConfigTed = () => {
    console.log('Configurações TED/DOC salvas');
    setOpenConfigTed(false);
  };

  // Funções para Internacional
  const handleAddBeneficiarioInt = () => {
    if (!novoBeneficiarioInt.nome || !novoBeneficiarioInt.swift) return;
    
    setBeneficiariosInt([...beneficiariosInt, {
      id: beneficiariosInt.length + 1,
      ...novoBeneficiarioInt,
    }]);
    setNovoBeneficiarioInt({ nome: '', pais: 'US', swift: '', iban: '' });
    setOpenAddBeneficiarioInt(false);
  };

  const handleDeleteBeneficiarioInt = (id: number) => {
    setBeneficiariosInt(beneficiariosInt.filter(b => b.id !== id));
  };

  const handleSalvarConfigInt = () => {
    console.log('Configurações Internacionais salvas');
    setOpenConfigInt(false);
  };

  // Funções para QR Code PIX
  const handleOpenQrCode = (mode: 'ler' | 'gerar') => {
    setQrCodeMode(mode);
    setOpenQrCodePix(true);
  };

  const handleGerarQrCode = () => {
    if (!valorQrCode) {
      alert('Informe o valor para gerar o QR Code');
      return;
    }
    // Simulação de geração de QR Code
    const qrCodeData = `00020126580014br.gov.bcb.pix0136${chavesPix[0].chave}520400005303986540${parseFloat(valorQrCode).toFixed(2)}5802BR5913ADMIN SISTEMA6009SAO PAULO62070503***6304`;
    setQrCodeGerado(qrCodeData);
  };

  const handleLerQrCode = (file: File) => {
    // Processa a imagem capturada e simula leitura do QR Code
    console.log('Processando QR Code da imagem:', file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      // Simulação de QR Code lido com sucesso
      // Em produção, aqui seria usado um decoder de QR Code
      const chavePrincipal = chavesPix.find(c => c.principal)?.chave || chavesPix[0]?.chave || '';
      
      // Preenche automaticamente os dados do PIX
      setChavePix(chavePrincipal);
      setValor('150.00'); // Valor exemplo do QR Code
      setDescricao('Pagamento via QR Code');
      
      // Fecha o dialog e mostra sucesso
      setOpenQrCodePix(false);
      setCameraAberta(false);
      
      alert('✅ QR Code PIX lido com sucesso!\n\nValor: R$ 150,00\nChave: ' + chavePrincipal + '\n\nDados preenchidos automaticamente na tela de envio.');
    };
    reader.readAsDataURL(file);
  };

  const handleFecharCamera = () => {
    setCameraAberta(false);
  };

  const handleCopiarQrCode = () => {
    navigator.clipboard.writeText(qrCodeGerado);
    alert('Código PIX copiado para a área de transferência!');
  };

  const handleBaixarQrCode = () => {
    alert('Download do QR Code iniciado!');
    console.log('QR Code:', qrCodeGerado);
  };

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
            onChange={(_, newValue: number) => setTabValue(newValue)}
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
          {/* Cabeçalho com botão de configurações */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: -2 }}>
              <Button
                variant="outlined"
                startIcon={<Settings />}
                onClick={() => setOpenConfigPix(true)}
                sx={{ borderRadius: 2 }}
              >
                Configurações PIX
              </Button>
            </Box>
          </Grid>
          
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
                  />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<QrCode2 />}
                      onClick={() => handleOpenQrCode('ler')}
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
                <IconButton color="primary" onClick={() => setOpenAddChave(true)}>
                  <Add />
                </IconButton>
              </Box>
              {chavesPix.map((chave) => (
                <Card key={chave.id} sx={{ mb: 2, bgcolor: chave.principal ? '#f0f7ff' : 'white' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {chave.tipo}
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {chave.chave}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {chave.principal && (
                          <Chip label="Principal" color="primary" size="small" />
                        )}
                        {!chave.principal && (
                          <IconButton size="small" onClick={() => handleSetPrincipal(chave.id)} title="Definir como principal">
                            <Star fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton size="small" onClick={() => navigator.clipboard.writeText(chave.chave)}>
                          <ContentCopy fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteChave(chave.id)}>
                          <Delete fontSize="small" />
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

      {/* Transferência */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          {/* Cabeçalho com botão de configurações */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: -2 }}>
              <Button
                variant="outlined"
                startIcon={<Settings />}
                onClick={() => setOpenConfigTransf(true)}
                sx={{ borderRadius: 2 }}
              >
                Configurações
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Fade in timeout={1000}>
              <Paper sx={{ 
                p: 4, 
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                background: 'white'
              }}>
                <Typography variant="h6" gutterBottom fontWeight={700} sx={{ mb: 3 }}>
                  🏦 Transferência entre Contas
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Banco"
                    select
                    value={bancoTransferencia}
                    onChange={(e) => setBancoTransferencia(e.target.value)}
                    sx={{ 
                      mb: 2.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  >
                    <option value="001">001 - Banco do Brasil</option>
                    <option value="237">237 - Bradesco</option>
                    <option value="341">341 - Itaú</option>
                    <option value="104">104 - Caixa Econômica</option>
                    <option value="033">033 - Santander</option>
                  </TextField>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Agência"
                        placeholder="0001"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        label="Conta"
                        placeholder="123456-7"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    fullWidth
                    label="Nome do Favorecido"
                    placeholder="Nome completo"
                    sx={{ 
                      mb: 2.5,
                      mt: 2.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="CPF/CNPJ"
                    placeholder="000.000.000-00"
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
                    rows={2}
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Send />}
                    sx={{ py: 1.5 }}
                  >
                    Transferir
                  </Button>
                </Box>
              </Paper>
            </Fade>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, bgcolor: '#f0f7ff' }}>
              <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
                ℹ️ Informações
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                • Transferências entre bancos podem levar até 1 dia útil
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                • Horário de funcionamento: 6h às 22h
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                • Sem taxas para mesma titularidade
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                • Taxa para outros titulares: R$ 8,00
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* TED/DOC */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          {/* Cabeçalho com botão de configurações */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: -2 }}>
              <Button
                variant="outlined"
                startIcon={<Settings />}
                onClick={() => setOpenConfigTed(true)}
                sx={{ borderRadius: 2 }}
              >
                Configurações TED/DOC
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Fade in timeout={1000}>
              <Paper sx={{ 
                p: 4, 
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                background: 'white'
              }}>
                <Typography variant="h6" gutterBottom fontWeight={700} sx={{ mb: 3 }}>
                  📄 TED/DOC
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Tipo de Transferência"
                    select
                    value={tipoTedDoc}
                    onChange={(e) => setTipoTedDoc(e.target.value)}
                    sx={{ 
                      mb: 2.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  >
                    <option value="TED">TED - Transferência Eletrônica Disponível</option>
                    <option value="DOC">DOC - Documento de Ordem de Crédito</option>
                  </TextField>
                  <TextField
                    fullWidth
                    label="Banco Destino"
                    select
                    value={bancoTedDoc}
                    onChange={(e) => setBancoTedDoc(e.target.value)}
                    sx={{ 
                      mb: 2.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  >
                    <option value="001">001 - Banco do Brasil</option>
                    <option value="237">237 - Bradesco</option>
                    <option value="341">341 - Itaú</option>
                    <option value="104">104 - Caixa Econômica</option>
                    <option value="033">033 - Santander</option>
                    <option value="260">260 - Nu Pagamentos (Nubank)</option>
                    <option value="077">077 - Banco Inter</option>
                  </TextField>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        label="Agência"
                        placeholder="0001"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={9}>
                      <TextField
                        fullWidth
                        label="Conta com Dígito"
                        placeholder="123456-7"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    fullWidth
                    label="Nome do Favorecido"
                    placeholder="Nome completo"
                    sx={{ 
                      mb: 2.5,
                      mt: 2.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="CPF/CNPJ do Favorecido"
                    placeholder="000.000.000-00"
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
                    label="Finalidade"
                    select
                    value={finalidadeTedDoc}
                    onChange={(e) => setFinalidadeTedDoc(e.target.value)}
                    sx={{ 
                      mb: 2.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  >
                    <option value="01">Crédito em Conta</option>
                    <option value="02">Pagamento de Aluguel</option>
                    <option value="03">Pagamento de Duplicatas</option>
                    <option value="04">Pagamento de Fornecedores</option>
                    <option value="05">Outros</option>
                  </TextField>
                  <TextField
                    fullWidth
                    label="Observação (opcional)"
                    multiline
                    rows={2}
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Send />}
                    sx={{ py: 1.5 }}
                  >
                    Confirmar Transferência
                  </Button>
                </Box>
              </Paper>
            </Fade>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, bgcolor: '#fff3e0' }}>
              <Typography variant="h6" gutterBottom fontWeight={600} color="warning.dark">
                ⚠️ Importante
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                <strong>TED:</strong> Cai no mesmo dia se feito até 17h
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                <strong>DOC:</strong> Cai em até 1 dia útil
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                <strong>Taxas:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, ml: 2 }}>
                • TED: R$ 12,00
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, ml: 2 }}>
                • DOC: R$ 8,00
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Internacional */}
      {tabValue === 3 && (
        <Grid container spacing={3}>
          {/* Cabeçalho com botão de configurações */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: -2 }}>
              <Button
                variant="outlined"
                startIcon={<Settings />}
                onClick={() => setOpenConfigInt(true)}
                sx={{ borderRadius: 2 }}
              >
                Configurações Internacionais
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Fade in timeout={1000}>
              <Paper sx={{ 
                p: 4, 
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                background: 'white'
              }}>
                <Typography variant="h6" gutterBottom fontWeight={700} sx={{ mb: 3 }}>
                  🌍 Transferência Internacional
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="País de Destino"
                    select
                    value={paisDestino}
                    onChange={(e) => setPaisDestino(e.target.value)}
                    sx={{ 
                      mb: 2.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  >
                    <option value="US">Estados Unidos</option>
                    <option value="GB">Reino Unido</option>
                    <option value="PT">Portugal</option>
                    <option value="ES">Espanha</option>
                    <option value="FR">França</option>
                    <option value="DE">Alemanha</option>
                    <option value="IT">Itália</option>
                    <option value="CA">Canadá</option>
                    <option value="AU">Austrália</option>
                  </TextField>
                  <TextField
                    fullWidth
                    label="Nome do Beneficiário"
                    placeholder="Full name"
                    sx={{ 
                      mb: 2.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="SWIFT/BIC Code"
                    placeholder="Ex: ABCDUS33XXX"
                    sx={{ 
                      mb: 2.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="IBAN / Número da Conta"
                    placeholder="Ex: GB29NWBK60161331926819"
                    sx={{ 
                      mb: 2.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Endereço do Beneficiário"
                    placeholder="Endereço completo"
                    sx={{ 
                      mb: 2.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Banco do Beneficiário"
                    placeholder="Nome do banco"
                    sx={{ 
                      mb: 2.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Moeda"
                        select
                        value={moedaSelecionada}
                        onChange={(e) => setMoedaSelecionada(e.target.value)}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      >
                        <option value="USD">USD - Dólar Americano</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - Libra Esterlina</option>
                        <option value="CAD">CAD - Dólar Canadense</option>
                        <option value="AUD">AUD - Dólar Australiano</option>
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Valor"
                        type="number"
                        placeholder="0.00"
                        value={valorInternacional}
                        onChange={(e) => setValorInternacional(e.target.value)}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    fullWidth
                    label="Motivo da Transferência"
                    select
                    value={motivoInternacional}
                    onChange={(e) => setMotivoInternacional(e.target.value)}
                    sx={{ 
                      mb: 2.5,
                      mt: 2.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  >
                    <option value="01">Manutenção de Residente</option>
                    <option value="02">Doação</option>
                    <option value="03">Serviços Educacionais</option>
                    <option value="04">Aluguel de Imóveis</option>
                    <option value="05">Investimentos</option>
                    <option value="06">Pagamento de Serviços</option>
                    <option value="07">Outros</option>
                  </TextField>
                  <TextField
                    fullWidth
                    label="Informações Adicionais"
                    multiline
                    rows={2}
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      {loadingRates ? (
                        'Carregando taxas de câmbio...'
                      ) : exchangeRates && valorInternacional ? (
                        <>
                          <strong>Cotação em tempo real:</strong> 1 {moedaSelecionada} = R$ {(1 / exchangeRates[moedaSelecionada]).toFixed(4)} • Total: R$ {calcularConversao().totalBRL.toFixed(2)} + taxa
                        </>
                      ) : (
                        'Digite um valor para ver a cotação'
                      )}
                    </Typography>
                  </Alert>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Send />}
                    sx={{ py: 1.5 }}
                  >
                    Solicitar Transferência
                  </Button>
                </Box>
              </Paper>
            </Fade>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, bgcolor: '#e3f2fd' }}>
              <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
                💱 Câmbio em Tempo Real
              </Typography>
              {loadingRates ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Carregando taxas...
                </Typography>
              ) : exchangeRates ? (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    <strong>Taxas de Câmbio:</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    • USD: R$ {(1 / exchangeRates.USD).toFixed(4)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    • EUR: R$ {(1 / exchangeRates.EUR).toFixed(4)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    • GBP: R$ {(1 / exchangeRates.GBP).toFixed(4)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    • CAD: R$ {(1 / exchangeRates.CAD).toFixed(4)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    • AUD: R$ {(1 / exchangeRates.AUD).toFixed(4)}
                  </Typography>
                  <Chip 
                    label="Atualizado agora" 
                    size="small" 
                    color="success" 
                    sx={{ mt: 2 }}
                  />
                </>
              ) : (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                  Erro ao carregar taxas
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                <strong>Taxas de Serviço:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                • Taxa fixa: R$ 45,00
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                • IOF: 1,1% sobre o valor
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                <strong>Prazo:</strong> 2 a 5 dias úteis
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Dialog de confirmação PIX */}
      <Dialog open={openPix} onClose={() => setOpenPix(false)} maxWidth="sm" fullWidth disableRestoreFocus>
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

      {/* Dialog Configurações PIX */}
      <Dialog open={openConfigPix} onClose={() => setOpenConfigPix(false)} maxWidth="md" fullWidth disableRestoreFocus>
        <DialogTitle>⚙️ Configurações PIX</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            {/* Limites PIX */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                💰 Limites de Transação
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                Configure os limites diários para suas transações PIX
              </Typography>
              
              {/* Limite Diário */}
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Limite Diário (6h às 20h)
              </Typography>
              <Box sx={{ px: 2, mt: 2, mb: 3 }}>
                <Slider
                  value={limiteDiario}
                  onChange={(e, newValue) => setLimiteDiario(newValue as number)}
                  min={1000}
                  max={20000}
                  step={500}
                  marks={[
                    { value: 1000, label: 'R$ 1k' },
                    { value: 10000, label: 'R$ 10k' },
                    { value: 20000, label: 'R$ 20k' },
                  ]}
                  valueLabelDisplay="on"
                  valueLabelFormat={(value) => `R$ ${(value / 1000).toFixed(1)}k`}
                />
              </Box>
              <Typography variant="h6" color="primary" sx={{ textAlign: 'center', mb: 3 }}>
                R$ {limiteDiario.toLocaleString('pt-BR')}
              </Typography>

              {/* Limite Noturno */}
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Limite Noturno (20h às 6h)
              </Typography>
              <Box sx={{ px: 2, mt: 2 }}>
                <Slider
                  value={limiteNoturno}
                  onChange={(e, newValue) => setLimiteNoturno(newValue as number)}
                  min={100}
                  max={5000}
                  step={100}
                  marks={[
                    { value: 100, label: 'R$ 100' },
                    { value: 2500, label: 'R$ 2.5k' },
                    { value: 5000, label: 'R$ 5k' },
                  ]}
                  valueLabelDisplay="on"
                  valueLabelFormat={(value) => `R$ ${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
                />
              </Box>
              <Typography variant="h6" color="primary" sx={{ textAlign: 'center' }}>
                R$ {limiteNoturno.toLocaleString('pt-BR')}
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                O limite noturno é uma medida de segurança para transações realizadas entre 20h e 6h.
              </Alert>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Notificações */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                🔔 Notificações PIX
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                Escolha quais notificações deseja receber
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificacoesPix.recebimento}
                    onChange={(e) => setNotificacoesPix({ ...notificacoesPix, recebimento: e.target.checked })}
                    color="primary"
                  />
                }
                label="Notificar quando receber PIX"
                sx={{ display: 'flex', mb: 1 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notificacoesPix.envio}
                    onChange={(e) => setNotificacoesPix({ ...notificacoesPix, envio: e.target.checked })}
                    color="primary"
                  />
                }
                label="Notificar quando enviar PIX"
                sx={{ display: 'flex', mb: 1 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notificacoesPix.chaveCadastrada}
                    onChange={(e) => setNotificacoesPix({ ...notificacoesPix, chaveCadastrada: e.target.checked })}
                    color="primary"
                  />
                }
                label="Notificar cadastro de novas chaves"
                sx={{ display: 'flex' }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Segurança */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                🔒 Segurança
              </Typography>
              <Alert severity="success" icon={<CheckCircle />}>
                <Typography variant="body2">
                  Todas as suas transações PIX são protegidas com criptografia de ponta a ponta e autenticação de dois fatores.
                </Typography>
              </Alert>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfigPix(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSalvarConfigPix}>
            Salvar Configurações
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Adicionar Chave PIX */}
      <Dialog open={openAddChave} onClose={() => setOpenAddChave(false)} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogTitle>➕ Adicionar Chave PIX</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Escolha o tipo de chave e insira os dados
            </Typography>
            
            <TextField
              fullWidth
              select
              label="Tipo de Chave"
              value={tipoChaveNova}
              onChange={(e) => setTipoChaveNova(e.target.value)}
              sx={{ mb: 3 }}
            >
              <option value="CPF">CPF</option>
              <option value="CNPJ">CNPJ</option>
              <option value="Email">Email</option>
              <option value="Telefone">Telefone</option>
              <option value="Aleatória">Chave Aleatória</option>
            </TextField>

            <TextField
              fullWidth
              label={`Digite seu ${tipoChaveNova}`}
              value={valorChaveNova}
              onChange={(e) => setValorChaveNova(e.target.value)}
              placeholder={
                tipoChaveNova === 'CPF' ? '000.000.000-00' :
                tipoChaveNova === 'Email' ? 'seu@email.com' :
                tipoChaveNova === 'Telefone' ? '+55 11 98765-4321' :
                tipoChaveNova === 'CNPJ' ? '00.000.000/0000-00' :
                'Será gerada automaticamente'
              }
              disabled={tipoChaveNova === 'Aleatória'}
            />

            <Alert severity="info" sx={{ mt: 3 }}>
              {tipoChaveNova === 'Aleatória' ? (
                'Uma chave aleatória será gerada automaticamente para você.'
              ) : (
                `Certifique-se de que o ${tipoChaveNova} está correto antes de cadastrar.`
              )}
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddChave(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleAddChave}
            disabled={!valorChaveNova && tipoChaveNova !== 'Aleatória'}
          >
            Cadastrar Chave
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Configurações Transferência */}
      <Dialog open={openConfigTransf} onClose={() => setOpenConfigTransf(false)} maxWidth="md" fullWidth disableRestoreFocus>
        <DialogTitle>⚙️ Configurações de Transferência</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            {/* Limites */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                💰 Limite de Transferência
              </Typography>
              <Box sx={{ px: 2, mt: 2 }}>
                <Slider
                  value={limiteTransferencia}
                  onChange={(e, newValue) => setLimiteTransferencia(newValue as number)}
                  min={1000}
                  max={50000}
                  step={1000}
                  marks={[
                    { value: 1000, label: 'R$ 1k' },
                    { value: 25000, label: 'R$ 25k' },
                    { value: 50000, label: 'R$ 50k' },
                  ]}
                  valueLabelDisplay="on"
                  valueLabelFormat={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
              </Box>
              <Typography variant="h6" color="primary" sx={{ textAlign: 'center', mt: 2 }}>
                R$ {limiteTransferencia.toLocaleString('pt-BR')}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Favorecidos */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  👥 Favorecidos
                </Typography>
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={() => setOpenAddFavorecido(true)}
                >
                  Adicionar
                </Button>
              </Box>
              <List>
                {favorecidos.map((fav) => (
                  <ListItem key={fav.id} sx={{ bgcolor: '#f5f7fa', borderRadius: 2, mb: 1 }}>
                    <ListItemText
                      primary={fav.nome}
                      secondary={`Banco ${fav.banco} - Ag: ${fav.agencia} - Conta: ${fav.conta}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" color="error" onClick={() => handleDeleteFavorecido(fav.id)}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Notificações */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                🔔 Notificações
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificacoesTransf.envio}
                    onChange={(e) => setNotificacoesTransf({ ...notificacoesTransf, envio: e.target.checked })}
                  />
                }
                label="Notificar transferências realizadas"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notificacoesTransf.agendamento}
                    onChange={(e) => setNotificacoesTransf({ ...notificacoesTransf, agendamento: e.target.checked })}
                  />
                }
                label="Notificar agendamentos"
                sx={{ display: 'flex' }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfigTransf(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSalvarConfigTransf}>
            Salvar Configurações
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Adicionar Favorecido */}
      <Dialog open={openAddFavorecido} onClose={() => setOpenAddFavorecido(false)} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogTitle>➕ Adicionar Favorecido</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <TextField
              fullWidth
              label="Nome do Favorecido"
              value={novoFavorecido.nome}
              onChange={(e) => setNovoFavorecido({ ...novoFavorecido, nome: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Banco"
              value={novoFavorecido.banco}
              onChange={(e) => setNovoFavorecido({ ...novoFavorecido, banco: e.target.value })}
              sx={{ mb: 2 }}
            >
              <option value="001">001 - Banco do Brasil</option>
              <option value="237">237 - Bradesco</option>
              <option value="341">341 - Itaú</option>
              <option value="104">104 - Caixa Econômica</option>
              <option value="033">033 - Santander</option>
            </TextField>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Agência"
                  value={novoFavorecido.agencia}
                  onChange={(e) => setNovoFavorecido({ ...novoFavorecido, agencia: e.target.value })}
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Conta"
                  value={novoFavorecido.conta}
                  onChange={(e) => setNovoFavorecido({ ...novoFavorecido, conta: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddFavorecido(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddFavorecido}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Configurações TED/DOC */}
      <Dialog open={openConfigTed} onClose={() => setOpenConfigTed(false)} maxWidth="md" fullWidth disableRestoreFocus>
        <DialogTitle>⚙️ Configurações TED/DOC</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            {/* Limites */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                💰 Limites de Operação
              </Typography>
              
              <Typography variant="body2" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                Limite TED
              </Typography>
              <Box sx={{ px: 2, mt: 2 }}>
                <Slider
                  value={limiteTed}
                  onChange={(e, newValue) => setLimiteTed(newValue as number)}
                  min={1000}
                  max={50000}
                  step={1000}
                  valueLabelDisplay="on"
                  valueLabelFormat={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
              </Box>
              <Typography variant="h6" color="primary" sx={{ textAlign: 'center', mb: 3 }}>
                R$ {limiteTed.toLocaleString('pt-BR')}
              </Typography>

              <Typography variant="body2" fontWeight={600} gutterBottom>
                Limite DOC
              </Typography>
              <Box sx={{ px: 2, mt: 2 }}>
                <Slider
                  value={limiteDoc}
                  onChange={(e, newValue) => setLimiteDoc(newValue as number)}
                  min={1000}
                  max={30000}
                  step={1000}
                  valueLabelDisplay="on"
                  valueLabelFormat={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
              </Box>
              <Typography variant="h6" color="primary" sx={{ textAlign: 'center' }}>
                R$ {limiteDoc.toLocaleString('pt-BR')}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Beneficiários */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  👥 Beneficiários Cadastrados
                </Typography>
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={() => setOpenAddBeneficiarioTed(true)}
                >
                  Adicionar
                </Button>
              </Box>
              <List>
                {beneficiariosTed.map((ben) => (
                  <ListItem key={ben.id} sx={{ bgcolor: '#f5f7fa', borderRadius: 2, mb: 1 }}>
                    <ListItemText
                      primary={ben.nome}
                      secondary={`Banco ${ben.banco} - Ag: ${ben.agencia} - Conta: ${ben.conta} - CPF: ${ben.cpf}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" color="error" onClick={() => handleDeleteBeneficiarioTed(ben.id)}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Agendamento */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                📅 Agendamento
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={permitirAgendamento}
                    onChange={(e) => setPermitirAgendamento(e.target.checked)}
                    color="primary"
                  />
                }
                label="Permitir agendamento de transferências"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Notificações */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                🔔 Notificações
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificacoesTed.envio}
                    onChange={(e) => setNotificacoesTed({ ...notificacoesTed, envio: e.target.checked })}
                  />
                }
                label="Notificar envio de TED/DOC"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notificacoesTed.confirmacao}
                    onChange={(e) => setNotificacoesTed({ ...notificacoesTed, confirmacao: e.target.checked })}
                  />
                }
                label="Notificar confirmação de crédito"
                sx={{ display: 'flex' }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notificacoesTed.agendamento}
                    onChange={(e) => setNotificacoesTed({ ...notificacoesTed, agendamento: e.target.checked })}
                  />
                }
                label="Notificar execução de agendamentos"
                sx={{ display: 'flex' }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfigTed(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSalvarConfigTed}>
            Salvar Configurações
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Adicionar Beneficiário TED */}
      <Dialog open={openAddBeneficiarioTed} onClose={() => setOpenAddBeneficiarioTed(false)} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogTitle>➕ Adicionar Beneficiário TED/DOC</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <TextField
              fullWidth
              label="Nome do Beneficiário"
              value={novoBeneficiarioTed.nome}
              onChange={(e) => setNovoBeneficiarioTed({ ...novoBeneficiarioTed, nome: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="CPF/CNPJ"
              value={novoBeneficiarioTed.cpf}
              onChange={(e) => setNovoBeneficiarioTed({ ...novoBeneficiarioTed, cpf: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Banco"
              value={novoBeneficiarioTed.banco}
              onChange={(e) => setNovoBeneficiarioTed({ ...novoBeneficiarioTed, banco: e.target.value })}
              sx={{ mb: 2 }}
            >
              <MenuItem value="001">001 - Banco do Brasil</MenuItem>
              <MenuItem value="237">237 - Bradesco</MenuItem>
              <MenuItem value="341">341 - Itaú</MenuItem>
              <MenuItem value="104">104 - Caixa Econômica</MenuItem>
              <MenuItem value="033">033 - Santander</MenuItem>
              <MenuItem value="260">260 - Nubank</MenuItem>
              <MenuItem value="077">077 - Inter</MenuItem>
            </TextField>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Agência"
                  value={novoBeneficiarioTed.agencia}
                  onChange={(e) => setNovoBeneficiarioTed({ ...novoBeneficiarioTed, agencia: e.target.value })}
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Conta"
                  value={novoBeneficiarioTed.conta}
                  onChange={(e) => setNovoBeneficiarioTed({ ...novoBeneficiarioTed, conta: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddBeneficiarioTed(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddBeneficiarioTed}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Configurações Internacional */}
      <Dialog open={openConfigInt} onClose={() => setOpenConfigInt(false)} maxWidth="md" fullWidth disableRestoreFocus>
        <DialogTitle>⚙️ Configurações de Transferências Internacionais</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            {/* Limite */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                💰 Limite de Remessa
              </Typography>
              <Box sx={{ px: 2, mt: 2 }}>
                <Slider
                  value={limiteInternacional}
                  onChange={(e, newValue) => setLimiteInternacional(newValue as number)}
                  min={500}
                  max={10000}
                  step={500}
                  marks={[
                    { value: 500, label: 'R$ 500' },
                    { value: 5000, label: 'R$ 5k' },
                    { value: 10000, label: 'R$ 10k' },
                  ]}
                  valueLabelDisplay="on"
                  valueLabelFormat={(value) => `R$ ${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
                />
              </Box>
              <Typography variant="h6" color="primary" sx={{ textAlign: 'center', mt: 2 }}>
                R$ {limiteInternacional.toLocaleString('pt-BR')}
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                Limite mensal para transferências internacionais conforme regulamentação do Banco Central.
              </Alert>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Beneficiários */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  🌍 Beneficiários Internacionais
                </Typography>
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={() => setOpenAddBeneficiarioInt(true)}
                >
                  Adicionar
                </Button>
              </Box>
              <List>
                {beneficiariosInt.map((ben) => (
                  <ListItem key={ben.id} sx={{ bgcolor: '#f5f7fa', borderRadius: 2, mb: 1 }}>
                    <ListItemText
                      primary={ben.nome}
                      secondary={`País: ${ben.pais} - SWIFT: ${ben.swift} - IBAN: ${ben.iban}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" color="error" onClick={() => handleDeleteBeneficiarioInt(ben.id)}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Países Permitidos */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                🌐 Países Permitidos
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                Ative ou desative transferências para países específicos
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={paisesPermitidos.US}
                        onChange={(e) => setPaisesPermitidos({ ...paisesPermitidos, US: e.target.checked })}
                      />
                    }
                    label="🇺🇸 Estados Unidos"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={paisesPermitidos.GB}
                        onChange={(e) => setPaisesPermitidos({ ...paisesPermitidos, GB: e.target.checked })}
                      />
                    }
                    label="🇬🇧 Reino Unido"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={paisesPermitidos.PT}
                        onChange={(e) => setPaisesPermitidos({ ...paisesPermitidos, PT: e.target.checked })}
                      />
                    }
                    label="🇵🇹 Portugal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={paisesPermitidos.ES}
                        onChange={(e) => setPaisesPermitidos({ ...paisesPermitidos, ES: e.target.checked })}
                      />
                    }
                    label="🇪🇸 Espanha"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={paisesPermitidos.FR}
                        onChange={(e) => setPaisesPermitidos({ ...paisesPermitidos, FR: e.target.checked })}
                      />
                    }
                    label="🇫🇷 França"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={paisesPermitidos.DE}
                        onChange={(e) => setPaisesPermitidos({ ...paisesPermitidos, DE: e.target.checked })}
                      />
                    }
                    label="🇩🇪 Alemanha"
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Notificações */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                🔔 Notificações
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificacoesInt.envio}
                    onChange={(e) => setNotificacoesInt({ ...notificacoesInt, envio: e.target.checked })}
                  />
                }
                label="Notificar envio de transferências"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notificacoesInt.confirmacao}
                    onChange={(e) => setNotificacoesInt({ ...notificacoesInt, confirmacao: e.target.checked })}
                  />
                }
                label="Notificar confirmação de crédito"
                sx={{ display: 'flex' }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notificacoesInt.cambio}
                    onChange={(e) => setNotificacoesInt({ ...notificacoesInt, cambio: e.target.checked })}
                  />
                }
                label="Notificar variações de câmbio significativas"
                sx={{ display: 'flex' }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfigInt(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSalvarConfigInt}>
            Salvar Configurações
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Adicionar Beneficiário Internacional */}
      <Dialog open={openAddBeneficiarioInt} onClose={() => setOpenAddBeneficiarioInt(false)} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogTitle>➕ Adicionar Beneficiário Internacional</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <TextField
              fullWidth
              label="Nome do Beneficiário"
              value={novoBeneficiarioInt.nome}
              onChange={(e) => setNovoBeneficiarioInt({ ...novoBeneficiarioInt, nome: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="País"
              value={novoBeneficiarioInt.pais}
              onChange={(e) => setNovoBeneficiarioInt({ ...novoBeneficiarioInt, pais: e.target.value })}
              sx={{ mb: 2 }}
            >
              <MenuItem value="US">Estados Unidos</MenuItem>
              <MenuItem value="GB">Reino Unido</MenuItem>
              <MenuItem value="PT">Portugal</MenuItem>
              <MenuItem value="ES">Espanha</MenuItem>
              <MenuItem value="FR">França</MenuItem>
              <MenuItem value="DE">Alemanha</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="SWIFT/BIC Code"
              value={novoBeneficiarioInt.swift}
              onChange={(e) => setNovoBeneficiarioInt({ ...novoBeneficiarioInt, swift: e.target.value })}
              placeholder="ABCDUS33XXX"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="IBAN / Número da Conta"
              value={novoBeneficiarioInt.iban}
              onChange={(e) => setNovoBeneficiarioInt({ ...novoBeneficiarioInt, iban: e.target.value })}
              placeholder="GB29NWBK60161331926819"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddBeneficiarioInt(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddBeneficiarioInt}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog PIX QR Code */}
      <Dialog open={openQrCodePix} onClose={() => setOpenQrCodePix(false)} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogTitle>
          {qrCodeMode === 'ler' ? '📷 Ler QR Code PIX' : '🎯 Gerar QR Code PIX'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            {/* Tabs para alternar entre Ler e Gerar */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Button
                fullWidth
                variant={qrCodeMode === 'ler' ? 'contained' : 'outlined'}
                onClick={() => setQrCodeMode('ler')}
                startIcon={<CameraAlt />}
              >
                Ler QR Code
              </Button>
              <Button
                fullWidth
                variant={qrCodeMode === 'gerar' ? 'contained' : 'outlined'}
                onClick={() => setQrCodeMode('gerar')}
                startIcon={<QrCode2 />}
              >
                Gerar QR Code
              </Button>
            </Box>

            {/* Modo: Ler QR Code */}
            {qrCodeMode === 'ler' && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                  Escolha uma opção para ler o QR Code PIX
                </Typography>

                {/* Opção 1: Câmera */}
                {!cameraAberta ? (
                  <Paper
                    component="label"
                    sx={{
                      p: 3,
                      mb: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: '2px dashed #2196F3',
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: '#f0f7ff',
                      },
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      hidden
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleLerQrCode(e.target.files[0]);
                        }
                      }}
                    />
                    <CameraAlt sx={{ fontSize: 48, color: '#2196F3', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Abrir Câmera
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tire uma foto do QR Code PIX
                    </Typography>
                  </Paper>
                ) : (
                  <Paper
                    sx={{
                      p: 3,
                      mb: 2,
                      textAlign: 'center',
                      border: '2px solid #2196F3',
                      borderRadius: 2,
                      bgcolor: '#f0f7ff',
                    }}
                  >
                    <Typography variant="h6" color="primary" gutterBottom>
                      📸 Câmera Ativada
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Aponte para o QR Code e tire uma foto
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={handleFecharCamera}
                      sx={{ mt: 2 }}
                    >
                      Fechar Câmera
                    </Button>
                  </Paper>
                )}

                {/* Opção 2: Upload de Imagem */}
                <Paper
                  component="label"
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '2px dashed #4caf50',
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: '#e8f5e9',
                    },
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleLerQrCode(e.target.files[0]);
                      }
                    }}
                  />
                  <Image sx={{ fontSize: 48, color: '#4caf50', mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    Carregar Imagem
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Selecione uma imagem do QR Code
                  </Typography>
                </Paper>

                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    <strong>Dica:</strong> Você também pode usar o PIX Copia e Cola! Basta colar o código no campo "Chave PIX" na tela de envio.
                  </Typography>
                </Alert>
              </Box>
            )}

            {/* Modo: Gerar QR Code */}
            {qrCodeMode === 'gerar' && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                  Gere um QR Code para receber PIX
                </Typography>

                {!qrCodeGerado ? (
                  <>
                    <TextField
                      fullWidth
                      label="Valor a Receber"
                      type="number"
                      value={valorQrCode}
                      onChange={(e) => setValorQrCode(e.target.value)}
                      placeholder="R$ 0,00"
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Descrição (opcional)"
                      value={descricaoQrCode}
                      onChange={(e) => setDescricaoQrCode(e.target.value)}
                      placeholder="Ex: Pagamento de serviço"
                      sx={{ mb: 2 }}
                    />
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        O QR Code será vinculado à sua chave PIX principal: <strong>{chavesPix.find(c => c.principal)?.chave}</strong>
                      </Typography>
                    </Alert>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleGerarQrCode}
                      disabled={!valorQrCode}
                      sx={{ py: 1.5 }}
                    >
                      Gerar QR Code
                    </Button>
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    {/* Simulação visual do QR Code */}
                    <Paper
                      sx={{
                        p: 3,
                        mb: 2,
                        bgcolor: '#f5f5f5',
                        border: '2px solid #2196F3',
                        borderRadius: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 200,
                          height: 200,
                          margin: '0 auto',
                          bgcolor: 'white',
                          border: '10px solid black',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        <QrCode2 sx={{ fontSize: 120, color: 'black' }} />
                        <Typography
                          variant="caption"
                          sx={{
                            position: 'absolute',
                            bottom: -25,
                            textAlign: 'center',
                            width: '100%',
                          }}
                        >
                          QR Code PIX
                        </Typography>
                      </Box>
                    </Paper>

                    <Typography variant="h5" color="primary" gutterBottom>
                      R$ {parseFloat(valorQrCode).toFixed(2)}
                    </Typography>
                    {descricaoQrCode && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {descricaoQrCode}
                      </Typography>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {/* PIX Copia e Cola */}
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      PIX Copia e Cola
                    </Typography>
                    <Paper
                      sx={{
                        p: 2,
                        mb: 2,
                        bgcolor: '#f5f5f5',
                        wordBreak: 'break-all',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        maxHeight: 100,
                        overflow: 'auto',
                      }}
                    >
                      {qrCodeGerado}
                    </Paper>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<ContentCopy />}
                          onClick={handleCopiarQrCode}
                        >
                          Copiar Código
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<Download />}
                          onClick={handleBaixarQrCode}
                        >
                          Baixar QR Code
                        </Button>
                      </Grid>
                    </Grid>

                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => {
                        setQrCodeGerado('');
                        setValorQrCode('');
                        setDescricaoQrCode('');
                      }}
                      sx={{ mt: 2 }}
                    >
                      Gerar Novo QR Code
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenQrCodePix(false);
            setQrCodeGerado('');
            setValorQrCode('');
            setDescricaoQrCode('');
          }}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
