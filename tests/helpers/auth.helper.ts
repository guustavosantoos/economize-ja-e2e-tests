import { APIRequestContext } from '@playwright/test';

export const API_BASE_URL = process.env.API_BASE_URL || 'https://api-production-4879.up.railway.app';
export const TEST_EMAIL = process.env.TEST_EMAIL || 'ci_e2e_runner@economizeja.com';
export const TEST_PASSWORD = process.env.TEST_PASSWORD || 'SenhaSegura@123';

let globalAuthToken: string | null = null;

export async function getAuthToken(request: APIRequestContext): Promise<string> {
  if (globalAuthToken) {
    return globalAuthToken;
  }

  // 1. Tenta fazer login com a conta fixa de testes CI
  let loginRes = await request.post(`${API_BASE_URL}/api/v1/auth/login`, {
    data: { email: TEST_EMAIL, password: TEST_PASSWORD },
  });

  let body = await loginRes.json();

  // 2. Se a conta ainda não existir, cria a conta fixa uma única vez
  if (loginRes.status() === 401 || !body?.data?.accessToken) {
    await request.post(`${API_BASE_URL}/api/v1/auth/register`, {
      data: {
        email: TEST_EMAIL,
        name: 'Runner Fixo CI/CD',
        password: TEST_PASSWORD,
      },
    });

    loginRes = await request.post(`${API_BASE_URL}/api/v1/auth/login`, {
      data: { email: TEST_EMAIL, password: TEST_PASSWORD },
    });
    body = await loginRes.json();
  }

  if (body?.data?.accessToken) {
    globalAuthToken = body.data.accessToken;
    return globalAuthToken;
  }

  throw new Error(`Falha ao obter token de autenticação: ${JSON.stringify(body)}`);
}
