import { test, expect } from '@playwright/test';

test.describe('API Tests - Economize Já Backend', () => {
  const API_BASE_URL = process.env.API_BASE_URL || 'https://api-production-4879.up.railway.app';

  test('GET /api/v1/categories - deve exigir autenticação (status 401 para requisições não autenticadas)', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/categories`);
    expect(response.status()).toBe(401);
  });

  test('POST /api/v1/auth/login - deve recusar credenciais inválidas com status 401', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/auth/login`, {
      data: {
        email: 'invalid_user_test@economizeja.com',
        password: 'wrongpassword123',
      },
    });

    expect(response.status()).toBe(401);
  });
});
