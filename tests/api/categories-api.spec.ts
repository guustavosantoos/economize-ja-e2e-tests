import { test, expect } from '@playwright/test';
import { API_BASE_URL, getAuthToken } from '../helpers/auth.helper';

test.describe('API REST - Categorias (/api/v1/categories)', () => {
  let token: string;
  let createdCategoryId: string;

  test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test('GET /api/v1/categories - deve exigir autenticação (401 sem token)', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/categories`);
    expect(response.status()).toBe(401);
  });

  test('GET /api/v1/categories - deve listar categorias do usuário autenticado', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('POST /api/v1/categories - deve criar nova categoria personalizada', async ({ request }) => {
    const categoryName = `Categoria API ${Date.now()}`;
    const response = await request.post(`${API_BASE_URL}/api/v1/categories`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: categoryName,
        type: 'expense',
        icon: 'shopping_cart',
        color: '#10B981',
        showInDashboard: true,
      },
    });

    expect([200, 201]).toContain(response.status());
    const body = await response.json();
    expect(body.data).toHaveProperty('id');
    expect(body.data.name).toBe(categoryName);

    createdCategoryId = body.data.id;
  });

  test('DELETE /api/v1/categories/{id} - deve remover a categoria criada', async ({ request }) => {
    test.skip(!createdCategoryId, 'Nenhuma categoria foi criada para deleção');

    const response = await request.delete(`${API_BASE_URL}/api/v1/categories/${createdCategoryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect([200, 204]).toContain(response.status());
  });
});
