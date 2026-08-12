import { APIRequestContext } from '@playwright/test';

export const API_BASE_URL = process.env.API_BASE_URL || 'https://api-production-4879.up.railway.app';
export const TEST_EMAIL = process.env.TEST_EMAIL || 'e2e_automation@economizeja.com';
export const TEST_PASSWORD = process.env.TEST_PASSWORD || 'SenhaSegura@123';

let cachedToken: string | null = null;

export async function getAuthToken(request: APIRequestContext): Promise<string> {
  if (cachedToken) {
    return cachedToken;
  }

  const loginRes = await request.post(`${API_BASE_URL}/api/v1/auth/login`, {
    data: { email: TEST_EMAIL, password: TEST_PASSWORD },
  });

  const body = await loginRes.json();

  if (loginRes.status() === 200 || loginRes.status() === 201) {
    if (body?.data?.accessToken) {
      cachedToken = body.data.accessToken;
      return cachedToken;
    }
  }

  // Tenta cadastrar o usuário caso a conta ainda não exista
  const registerRes = await request.post(`${API_BASE_URL}/api/v1/auth/register`, {
    data: {
      email: TEST_EMAIL,
      name: 'Automated E2E Test User',
      password: TEST_PASSWORD,
    },
  });

  if (registerRes.status() === 200 || registerRes.status() === 201) {
    const reloginRes = await request.post(`${API_BASE_URL}/api/v1/auth/login`, {
      data: { email: TEST_EMAIL, password: TEST_PASSWORD },
    });
    const reloginBody = await reloginRes.json();
    cachedToken = reloginBody.data.accessToken;
    return cachedToken;
  }

  throw new Error(`Não foi possível autenticar o usuário de teste: ${JSON.stringify(body)}`);
}
