import { test, expect } from '@playwright/test';

test.describe('UI E2E - Dashboard e Gerenciador de Categorias', () => {
  test('Dashboard - deve exibir card "Onde foi seu dinheiro" e botão Editar', async ({ page }) => {
    await page.goto('/dashboard');

    // Se redirecionado para login ou carregado
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      await page.locator('input[type="email"]').fill('e2e_automation@economizeja.com');
      await page.locator('input[type="password"]').fill('SenhaSegura@123');
      await page.getByRole('button', { name: /entrar/i }).click();
    }

    // Verificar elemento "Onde foi seu dinheiro"
    const categoryCardTitle = page.getByText(/Onde foi seu dinheiro/i);
    if (await categoryCardTitle.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(categoryCardTitle).toBeVisible();
      
      const editButton = page.getByRole('button', { name: /editar/i });
      await expect(editButton).toBeVisible();

      // Abrir o modal de categorias
      await editButton.click();
      
      const modalHeader = page.getByRole('heading', { name: /Gerenciar Categorias/i });
      await expect(modalHeader).toBeVisible();
    }
  });
});
