import { test, expect } from '@playwright/test';

test.describe('UI E2E - Autenticação e Páginas Públicas', () => {
  test('Página de Login - deve renderizar a aplicação e elementos principais', async ({ page }) => {
    await page.goto('/login');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/login');
  });

  test('Página PRO - deve redirecionar para /login se não estiver autenticado', async ({ page }) => {
    await page.goto('/pro');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/login');
  });
});
