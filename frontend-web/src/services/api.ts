import axios from 'axios';

// Usa proxy do Vite - todas as requisições vão via /api
const api = axios.create({
  baseURL: '/api',
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

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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
