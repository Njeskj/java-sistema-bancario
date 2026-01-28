import axios from 'axios';
import storage from '../utils/storage';

// Para desenvolvimento web: localhost
// Para mobile: IP da máquina (192.168.1.163)
const API_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await storage.removeItem('token');
      // Redirecionar para login
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (emailOuCpf: string, senha: string) => {
    const response = await api.post('/auth/login', { emailOuCpf, senha });
    if (response.data.token) {
      await storage.setItem('token', response.data.token);
    }
    return response.data;
  },

  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout: async () => {
    await storage.removeItem('token');
  },
};

export const contaService = {
  getSaldo: async (contaId: number) => {
    const response = await api.get(`/contas/${contaId}/saldo`);
    return response.data;
  },

  getExtrato: async (contaId: number, dataInicio?: string, dataFim?: string) => {
    const params = new URLSearchParams();
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);
    
    const response = await api.get(`/contas/${contaId}/extrato?${params}`);
    return response.data;
  },

  realizarTransferencia: async (data: any) => {
    const response = await api.post('/contas/transferencia', data);
    return response.data;
  },

  realizarSaque: async (contaId: number, valor: number, moeda: string = 'BRL') => {
    const response = await api.post(`/contas/${contaId}/saque`, { valor, moeda });
    return response.data;
  },

  realizarDeposito: async (contaId: number, valor: number, moeda: string = 'BRL') => {
    const response = await api.post(`/contas/${contaId}/deposito`, { valor, moeda });
    return response.data;
  },
};

export default api;
