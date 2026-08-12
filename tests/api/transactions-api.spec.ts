import { test, expect } from '@playwright/test';
import { API_BASE_URL, getAuthToken } from '../helpers/auth.helper';

test.describe('API REST - Transações (/api/v1/transactions)', () => {
  let token: string;
  let createdExpenseId: string;
  let createdIncomeId: string;

  test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test('POST /api/v1/transactions - deve criar nova transação de DESPESA (expense)', async ({ request }) => {
    const today = new Date().toISOString().split('T')[0];
    const response = await request.post(`${API_BASE_URL}/api/v1/transactions`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        type: 'expense',
        amount: 89.90,
        date: today,
        description: `Despesa Teste API ${Date.now()}`,
        paymentMethod: 'credit',
      },
    });

    expect([200, 201]).toContain(response.status());
    const body = await response.json();
    expect(body.data).toHaveProperty('id');
    expect(Number(body.data.amount)).toBe(89.90);
    expect(body.data.type).toBe('expense');

    createdExpenseId = body.data.id;
  });

  test('POST /api/v1/transactions - deve criar nova transação de RECEITA (income)', async ({ request }) => {
    const today = new Date().toISOString().split('T')[0];
    const response = await request.post(`${API_BASE_URL}/api/v1/transactions`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        type: 'income',
        amount: 2500.00,
        date: today,
        description: `Receita Freela API ${Date.now()}`,
        paymentMethod: 'debit',
      },
    });

    expect([200, 201]).toContain(response.status());
    const body = await response.json();
    expect(body.data).toHaveProperty('id');
    expect(Number(body.data.amount)).toBe(2500.00);
    expect(body.data.type).toBe('income');

    createdIncomeId = body.data.id;
  });

  test('GET /api/v1/transactions - deve retornar lista de transações do usuário', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/transactions`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('DELETE /api/v1/transactions/{id} - deve remover as transações de teste criadas', async ({ request }) => {
    if (createdExpenseId) {
      const resExp = await request.delete(`${API_BASE_URL}/api/v1/transactions/${createdExpenseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect([200, 204]).toContain(resExp.status());
    }

    if (createdIncomeId) {
      const resInc = await request.delete(`${API_BASE_URL}/api/v1/transactions/${createdIncomeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect([200, 204]).toContain(resInc.status());
    }
  });
});
