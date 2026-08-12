import { APIRequestContext } from '@playwright/test';

export const API_BASE_URL = process.env.API_BASE_URL || 'https://api-production-4879.up.railway.app';
export const TEST_PASSWORD = process.env.TEST_PASSWORD || 'SenhaSegura@123';

let globalAuthToken: string | null = null;

export async function getAuthToken(request: APIRequestContext): Promise<string> {
  if (globalAuthToken) {
    return globalAuthToken;
  }

  const uniqueEmail = `e2e_${Date.now()}_${Math.floor(Math.random() * 10000)}@economizeja.com`;

  // Cadastra um novo usuário de teste isolado para o runner
  const regRes = await request.post(`${API_BASE_URL}/api/v1/auth/register`, {
    data: {
      email: uniqueEmail,
      name: 'Automated E2E Runner User',
      password: TEST_PASSWORD,
    },
  });

  const loginRes = await request.post(`${API_BASE_URL}/api/v1/auth/login`, {
    data: { email: uniqueEmail, password: TEST_PASSWORD },
  });

  const body = await loginRes.json();
  if (body?.data?.accessToken) {
    globalAuthToken = body.data.accessToken;
    return globalAuthToken;
  }

  throw new Error(`Falha ao obter token de autenticação: ${JSON.stringify(body)}`);
}
