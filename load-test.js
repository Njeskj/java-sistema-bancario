import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Métricas customizadas
const errorRate = new Rate('errors');

// Configuração de carga
export const options = {
  stages: [
    { duration: '1m', target: 10 },   // Ramp up para 10 usuários em 1 min
    { duration: '3m', target: 50 },   // Aumenta para 50 usuários em 3 min
    { duration: '5m', target: 50 },   // Mantém 50 usuários por 5 min
    { duration: '2m', target: 100 },  // Pico de 100 usuários por 2 min
    { duration: '2m', target: 0 },    // Ramp down para 0
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% das requisições abaixo de 500ms
    'errors': ['rate<0.1'],              // Taxa de erro menor que 10%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8081';

// Dados de teste
const testUser = {
  emailOuCpf: 'teste@example.com',
  senha: 'senha123'
};

export function setup() {
  // Registrar usuário de teste (se necessário)
  const registerPayload = JSON.stringify({
    nome: 'Teste',
    sobrenome: 'LoadTest',
    cpf: '12345678901',
    email: 'teste@example.com',
    telefone: '11999999999',
    senha: 'senha123',
    dataNascimento: '1990-01-01',
    nacionalidade: 'BR',
    cidade: 'São Paulo'
  });

  http.post(`${BASE_URL}/api/auth/register`, registerPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  return { token: null };
}

export default function (data) {
  // 1. Login
  const loginPayload = JSON.stringify(testUser);
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  const loginSuccess = check(loginRes, {
    'login status 200': (r) => r.status === 200,
    'login tem token': (r) => r.json('token') !== undefined,
  });
  errorRate.add(!loginSuccess);

  if (!loginSuccess) {
    return;
  }

  const token = loginRes.json('token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  sleep(1);

  // 2. Buscar contas do usuário
  const contasRes = http.get(`${BASE_URL}/api/contas/usuario/1`, { headers });
  const contasSuccess = check(contasRes, {
    'contas status 200': (r) => r.status === 200,
  });
  errorRate.add(!contasSuccess);

  sleep(1);

  // 3. Buscar saldo
  const saldoRes = http.get(`${BASE_URL}/api/contas/1/saldo`, { headers });
  const saldoSuccess = check(saldoRes, {
    'saldo status 200': (r) => r.status === 200,
  });
  errorRate.add(!saldoSuccess);

  sleep(1);

  // 4. Buscar extrato paginado
  const extratoRes = http.get(
    `${BASE_URL}/api/contas/1/extrato?page=0&size=20&sort=dataTransacao,desc`,
    { headers }
  );
  const extratoSuccess = check(extratoRes, {
    'extrato status 200': (r) => r.status === 200,
    'extrato tem paginação': (r) => r.json('totalPages') !== undefined,
  });
  errorRate.add(!extratoSuccess);

  sleep(2);
}

export function teardown(data) {
  console.log('Load test finalizado');
}
