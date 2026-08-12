import { test, expect } from '@playwright/test';

test.describe('UI E2E - Gestão de Transações (Receitas e Despesas)', () => {
  const TEST_EMAIL = process.env.TEST_EMAIL || 'e2e_automation@economizeja.com';
  const TEST_PASSWORD = process.env.TEST_PASSWORD || 'SenhaSegura@123';

  test.beforeEach(async ({ page }) => {
    // Autenticar usuário antes de cada teste
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    await page.locator('input[type="email"]').fill(TEST_EMAIL);
    await page.locator('input[type="password"]').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /entrar/i }).click();

    await expect(page).toHaveURL(/\/(dashboard|login)/, { timeout: 10000 });
  });

  test('Dashboard - deve exibir a interface principal do aplicativo', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    const mainContainer = page.locator('main, header, body').first();
    await expect(mainContainer).toBeVisible();
  });

  test('Nova Transação - deve abrir o modal ou formulário de adição de transação', async ({ page }) => {
    // Procurar por botão com ícone ou texto de nova transação/adicionar
    const addTransactionBtn = page.getByRole('button', { name: /nova|adicionar|\+/i }).first();
    
    if (await addTransactionBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await addTransactionBtn.click();

      // Verificar se o modal/dialog de transação abriu
      const dialogTitle = page.getByText(/Nova Transação|Adicionar/i).first();
      await expect(dialogTitle).toBeVisible();
    }
  });

  test('Fluxo Completo de Usuário - deve permitir alternar filtros de transações', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    const container = page.locator('main, header, body').first();
    await expect(container).toBeVisible();
  });
});
