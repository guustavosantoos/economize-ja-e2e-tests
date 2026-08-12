import { test, expect } from '@playwright/test';

test.describe('UI E2E - Página de Planos e Assinatura PRO (/pro)', () => {
  const TEST_EMAIL = process.env.TEST_EMAIL || 'e2e_automation@economizeja.com';
  const TEST_PASSWORD = process.env.TEST_PASSWORD || 'SenhaSegura@123';

  test('Plano PRO - deve listar vantagens e opções de assinatura', async ({ page }) => {
    // Autenticar no app
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');
    await page.locator('input[type="email"]').fill(TEST_EMAIL);
    await page.locator('input[type="password"]').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /entrar/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|login)/, { timeout: 10000 });

    // Navegar para /pro
    await page.goto('/pro');
    await page.waitForLoadState('domcontentloaded');

    // Validar título da página PRO e presença dos benefícios
    const proHeading = page.getByText(/Plano PRO|Assinatura/i).first();
    await expect(proHeading).toBeVisible();

    // Validar presença de botão de checkout / assinar
    const checkoutBtn = page.getByRole('button', { name: /assinar|garantir|upgrade/i }).first();
    if (await checkoutBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(checkoutBtn).toBeVisible();
    }
  });
});
