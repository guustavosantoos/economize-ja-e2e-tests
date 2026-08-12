const { chromium } = require('@playwright/test');

async function captureDashboardScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2, // Retinal HD quality
  });
  const page = await context.newPage();

  console.log('Navigating to Economize Já...');
  await page.goto('https://economize-ja-production.up.railway.app/login');
  await page.waitForLoadState('networkidle');

  // Preencher login com usuário de teste ou teste público
  const emailInput = page.locator('input[type="email"]');
  if (await emailInput.isVisible()) {
    await emailInput.fill('teste@economizeja.com');
    await page.locator('input[type="password"]').fill('Test@1234');
    await page.getByRole('button', { name: /entrar/i }).click().catch(() => {});
    await page.waitForTimeout(2000);
  }

  // 1. Screenshot Dashboard
  await page.goto('https://economize-ja-production.up.railway.app/dashboard');
  await page.waitForTimeout(2000);
  const dashboardPath = '/Users/gustavobraulio/.gemini/antigravity-ide/brain/0c4146a8-1820-4fa8-b201-034e3266a731/dashboard_screenshot.png';
  await page.screenshot({ path: dashboardPath, fullPage: false });
  console.log('Captured Dashboard screenshot!');

  // 2. Screenshot Modal de Gerenciar Categorias
  const editBtn = page.getByRole('button', { name: /editar/i });
  if (await editBtn.isVisible().catch(() => false)) {
    await editBtn.click();
    await page.waitForTimeout(1000);
    const categoryModalPath = '/Users/gustavobraulio/.gemini/antigravity-ide/brain/0c4146a8-1820-4fa8-b201-034e3266a731/category_manager_screenshot.png';
    await page.screenshot({ path: categoryModalPath, fullPage: false });
    console.log('Captured Category Manager Modal screenshot!');
    await page.keyboard.press('Escape');
  }

  // 3. Screenshot Transações
  await page.goto('https://economize-ja-production.up.railway.app/transactions');
  await page.waitForTimeout(2000);
  const transactionsPath = '/Users/gustavobraulio/.gemini/antigravity-ide/brain/0c4146a8-1820-4fa8-b201-034e3266a731/transactions_screenshot.png';
  await page.screenshot({ path: transactionsPath, fullPage: false });
  console.log('Captured Transactions screenshot!');

  await browser.close();
}

captureDashboardScreenshots().catch(console.error);
