import { test, expect } from '@playwright/test';
import { API_BASE_URL, getAuthToken } from '../helpers/auth.helper';

test.describe('API REST - Dashboard & Resumos (/api/v1/dashboard)', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test('GET /api/v1/dashboard/summary - deve retornar os totais financeiros do usuário', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/dashboard/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data).toHaveProperty('balance');
    expect(body.data).toHaveProperty('totalIncome');
    expect(body.data).toHaveProperty('totalExpense');
  });
});
