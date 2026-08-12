import { test, expect } from '@playwright/test';
import { API_BASE_URL, TEST_EMAIL, TEST_PASSWORD, getAuthToken } from '../helpers/auth.helper';

test.describe('API REST - Autenticação & Usuários (/api/v1/auth & /api/v1/users)', () => {
  test('POST /api/v1/auth/login - deve realizar login com sucesso e retornar accessToken', async ({ request }) => {
    const token = await getAuthToken(request);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(10);
  });

  test('POST /api/v1/auth/login - deve recusar senha incorreta com status 401', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/auth/login`, {
      data: {
        email: TEST_EMAIL,
        password: 'SenhaTotalmenteIncorreta123!',
      },
    });

    expect(response.status()).toBe(401);
  });

  test('POST /api/v1/auth/register - deve rejeitar payload sem campos obrigatórios', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/auth/register`, {
      data: {
        email: 'email_invalido_sem_senha@teste.com',
      },
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('GET /api/v1/users/me - deve retornar perfil do usuário autenticado', async ({ request }) => {
    const token = await getAuthToken(request);

    const userRes = await request.get(`${API_BASE_URL}/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(userRes.status()).toBe(200);
    const userBody = await userRes.json();
    expect(userBody.data).toHaveProperty('email');
    expect(userBody.data.email).toBe(TEST_EMAIL);
  });
});
