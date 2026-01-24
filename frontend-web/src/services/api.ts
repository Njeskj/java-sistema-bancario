import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: async (cpf: string, senha: string) => {
    return api.post('/auth/login', { cpf, senha });
  },

  register: async (data: any) => {
    return api.post('/auth/register', data);
  },

  logout: async () => {
    return api.post('/auth/logout');
  },
};

// Contas API
export const contasApi = {
  getContas: async (usuarioId: number) => {
    return api.get(`/contas/usuario/${usuarioId}`);
  },

  getSaldo: async (contaId: number) => {
    return api.get(`/contas/${contaId}/saldo`);
  },

  transferir: async (data: any) => {
    return api.post('/contas/transferencia', data);
  },

  getExtrato: async (contaId: number, dataInicio?: string, dataFim?: string) => {
    return api.get(`/contas/${contaId}/extrato`, {
      params: { dataInicio, dataFim },
    });
  },
};

export default api;
