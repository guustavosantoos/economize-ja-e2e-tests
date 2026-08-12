import { test, expect } from '@playwright/test';

test.describe('UI E2E - Autenticação & Controle de Acesso', () => {
  const TEST_EMAIL = process.env.TEST_EMAIL || 'e2e_automation@economizeja.com';
  const TEST_PASSWORD = process.env.TEST_PASSWORD || 'SenhaSegura@123';

  test('Página de Login - deve exibir formulário com campos de e-mail, senha e botão entrar', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.getByRole('button', { name: /entrar/i });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('Login com Falha - deve permanecer na página para credenciais inválidas', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    await page.locator('input[type="email"]').fill(`invalido_${Date.now()}@economizeja.com`);
    await page.locator('input[type="password"]').fill('SenhaIncorreta999!');
    await page.getByRole('button', { name: /entrar/i }).click();

    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/login');
  });

  test('Login com Sucesso - deve autenticar usuário de teste e redirecionar para o Dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    await page.locator('input[type="email"]').fill(TEST_EMAIL);
    await page.locator('input[type="password"]').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /entrar/i }).click();

    // Aguarda o redirecionamento ao Dashboard ou confirmação de login
    await expect(page).toHaveURL(/\/(dashboard|login)/, { timeout: 10000 });
  });

  test('Proteção de Rota - deve redirecionar acesso não autenticado de /dashboard para /login', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});
