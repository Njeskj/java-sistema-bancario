import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Link, 
  Grid, 
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../components/Toast';

interface FormData {
  // Dados Pessoais
  nome: string;
  sobrenome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  telefonePais: string;
  nacionalidade: string;
  
  // Dados de Acesso
  email: string;
  senha: string;
  confirmarSenha: string;
  
  // Dados da Conta
  tipoConta: string;
  moedaPreferencial: string;
  idioma: string;
}

export default function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    sobrenome: '',
    cpf: '',
    dataNascimento: '',
    telefone: '',
    telefonePais: '+55',
    nacionalidade: 'BR',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipoConta: 'CORRENTE',
    moedaPreferencial: 'BRL',
    idioma: 'pt-BR'
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const steps = ['Dados Pessoais', 'Dados de Acesso', 'Tipo de Conta'];

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (step === 0) {
      // Validar Dados Pessoais
      if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
      if (!formData.sobrenome.trim()) newErrors.sobrenome = 'Sobrenome é obrigatório';
      if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
      else if (formData.cpf.replace(/\D/g, '').length !== 11) {
        newErrors.cpf = 'CPF deve ter 11 dígitos';
      }
      if (!formData.dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória';
      if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    }
    
    if (step === 1) {
      // Validar Dados de Acesso
      if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
      if (!formData.senha) newErrors.senha = 'Senha é obrigatória';
      else if (formData.senha.length < 6) {
        newErrors.senha = 'Senha deve ter no mínimo 6 caracteres';
      }
      if (formData.senha !== formData.confirmarSenha) {
        newErrors.confirmarSenha = 'Senhas não coincidem';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
    // Limpar erro do campo ao editar
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) return;
    
    setLoading(true);
    
    try {
      const payload = {
        nome: formData.nome,
        sobrenome: formData.sobrenome,
        cpf: formData.cpf.replace(/\D/g, ''),
        email: formData.email,
        telefone: formData.telefone.replace(/\D/g, ''),
        senha: formData.senha,
        dataNascimento: formData.dataNascimento,
        nacionalidade: formData.nacionalidade
      };

      console.log('Enviando registro:', payload);

      const response = await api.post('/auth/register', payload);
      
      showToast('Conta criada com sucesso! Faça login para continuar.', 'success');
      
      // Aguardar 2s e redirecionar para login
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      
      if (error.response?.data?.message) {
        showToast(error.response.data.message, 'error');
      } else if (error.response?.status === 409) {
        showToast('Email ou CPF já cadastrado', 'error');
      } else {
        showToast('Erro ao criar conta. Tente novamente.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>
              💳 IBank
            </Typography>
            <Typography variant="h5" gutterBottom>
              Abrir Conta
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Complete o cadastro em 3 passos simples
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* PASSO 1: Dados Pessoais */}
          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Nome" 
                  required 
                  value={formData.nome}
                  onChange={handleChange('nome')}
                  error={!!errors.nome}
                  helperText={errors.nome}
                  inputProps={{ 'data-testid': 'input-nome' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Sobrenome" 
                  required 
                  value={formData.sobrenome}
                  onChange={handleChange('sobrenome')}
                  error={!!errors.sobrenome}
                  helperText={errors.sobrenome}
                  inputProps={{ 'data-testid': 'input-sobrenome' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="CPF" 
                  required 
                  placeholder="000.000.000-00"
                  value={formatCPF(formData.cpf)}
                  onChange={(e) => {
                    const numbers = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, cpf: numbers });
                  }}
                  error={!!errors.cpf}
                  helperText={errors.cpf}
                  inputProps={{ 'data-testid': 'input-cpf', maxLength: 14 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Data de Nascimento" 
                  type="date" 
                  required 
                  InputLabelProps={{ shrink: true }}
                  value={formData.dataNascimento}
                  onChange={handleChange('dataNascimento')}
                  error={!!errors.dataNascimento}
                  helperText={errors.dataNascimento}
                  inputProps={{ 'data-testid': 'input-data-nascimento' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Telefone" 
                  required 
                  placeholder="(11) 98765-4321"
                  value={formatPhone(formData.telefone)}
                  onChange={(e) => {
                    const numbers = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, telefone: numbers });
                  }}
                  error={!!errors.telefone}
                  helperText={errors.telefone}
                  inputProps={{ 'data-testid': 'input-telefone', maxLength: 15 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  select 
                  label="Nacionalidade" 
                  value={formData.nacionalidade}
                  onChange={handleChange('nacionalidade')}
                  inputProps={{ 'data-testid': 'input-nacionalidade' }}
                >
                  <MenuItem value="BR">Brasil 🇧🇷</MenuItem>
                  <MenuItem value="PT">Portugal 🇵🇹</MenuItem>
                  <MenuItem value="US">Estados Unidos 🇺🇸</MenuItem>
                  <MenuItem value="ES">Espanha 🇪🇸</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          )}

          {/* PASSO 2: Dados de Acesso */}
          {activeStep === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Email" 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={handleChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  inputProps={{ 'data-testid': 'input-email' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Senha" 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.senha}
                  onChange={handleChange('senha')}
                  error={!!errors.senha}
                  helperText={errors.senha || 'Mínimo 6 caracteres'}
                  inputProps={{ 'data-testid': 'input-senha' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Confirmar Senha" 
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmarSenha}
                  onChange={handleChange('confirmarSenha')}
                  error={!!errors.confirmarSenha}
                  helperText={errors.confirmarSenha}
                  inputProps={{ 'data-testid': 'input-confirmar-senha' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 1 }}>
                  <strong>Dica:</strong> Use uma senha forte com letras, números e caracteres especiais
                </Alert>
              </Grid>
            </Grid>
          )}

          {/* PASSO 3: Tipo de Conta */}
          {activeStep === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  select 
                  label="Tipo de Conta" 
                  value={formData.tipoConta}
                  onChange={handleChange('tipoConta')}
                  helperText="Escolha o tipo de conta que melhor atende suas necessidades"
                  inputProps={{ 'data-testid': 'input-tipo-conta' }}
                >
                  <MenuItem value="CORRENTE">Conta Corrente - Uso diário com cartão</MenuItem>
                  <MenuItem value="POUPANCA">Conta Poupança - Para guardar dinheiro</MenuItem>
                  <MenuItem value="SALARIO">Conta Salário - Recebimento de salário</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  select 
                  label="Moeda Principal" 
                  value={formData.moedaPreferencial}
                  onChange={handleChange('moedaPreferencial')}
                  inputProps={{ 'data-testid': 'input-moeda' }}
                >
                  <MenuItem value="BRL">Real Brasileiro (R$)</MenuItem>
                  <MenuItem value="USD">Dólar Americano (US$)</MenuItem>
                  <MenuItem value="EUR">Euro (€)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  select 
                  label="Idioma" 
                  value={formData.idioma}
                  onChange={handleChange('idioma')}
                  inputProps={{ 'data-testid': 'input-idioma' }}
                >
                  <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
                  <MenuItem value="pt-PT">Português (Portugal)</MenuItem>
                  <MenuItem value="en-US">English (US)</MenuItem>
                  <MenuItem value="es-ES">Español</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Alert severity="success" icon={<CheckCircle />}>
                  <strong>Pronto!</strong> Revise seus dados e clique em "Criar Conta" para finalizar
                </Alert>
              </Grid>
            </Grid>
          )}

          {/* Botões de Navegação */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              data-testid="btn-voltar"
            >
              Voltar
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              data-testid={activeStep === steps.length - 1 ? "btn-criar-conta" : "btn-proximo"}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : activeStep === steps.length - 1 ? (
                'Criar Conta'
              ) : (
                'Próximo'
              )}
            </Button>
          </Box>

          <Typography variant="body2" textAlign="center" sx={{ mt: 3 }}>
            Já tem uma conta?{' '}
            <Link href="/login" underline="hover">
              Entrar
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
