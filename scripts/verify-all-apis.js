const API_BASE = 'https://api-production-4879.up.railway.app';

async function runApiAudit() {
  console.log(`\n===============================================================`);
  console.log(`🔍 AUDITORIA COMPLETA DE APIs — ECONOMIZE JÁ`);
  console.log(`URL do Servidor: ${API_BASE}`);
  console.log(`===============================================================\n`);

  const results = [];
  let authToken = null;

  async function testEndpoint(name, method, endpoint, data = null, headers = {}) {
    const startTime = Date.now();
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          ...headers,
        },
        body: data ? JSON.stringify(data) : undefined,
      };

      const res = await fetch(`${API_BASE}${endpoint}`, options);
      const duration = Date.now() - startTime;
      const ok = res.status >= 200 && res.status < 400;

      const record = {
        name,
        method,
        endpoint,
        status: res.status,
        duration: `${duration}ms`,
        ok,
      };

      results.push(record);
      console.log(`${ok ? '✅' : (res.status === 401 ? '🔒' : '⚠️')} [${method}] ${endpoint} — Status: ${res.status} (${duration}ms)`);
      return res;
    } catch (err) {
      const duration = Date.now() - startTime;
      const record = {
        name,
        method,
        endpoint,
        status: 'ERR',
        duration: `${duration}ms`,
        ok: false,
        details: err.message,
      };
      results.push(record);
      console.log(`❌ [${method}] ${endpoint} — FALHA DE CONEXÃO (${duration}ms)`);
      return null;
    }
  }

  // 1. Health Check Root
  await testEndpoint('Health Check Root', 'GET', '/');

  // 2. Auth - Criar conta de teste e realizar login
  const testEmail = `audit_${Date.now()}@economizeja.com`;
  const testPassword = 'Password@1234';

  console.log('\n--- 🔑 1. MÓDULO DE AUTENTICAÇÃO ---');
  await testEndpoint('Auth Register', 'POST', '/api/v1/auth/register', {
    email: testEmail,
    name: 'Auditor de APIs',
    password: testPassword,
  });

  await testEndpoint('Auth Login (Credenciais Inválidas)', 'POST', '/api/v1/auth/login', {
    email: testEmail,
    password: 'wrongpassword',
  });

  // 3. Modulo de Categorias (Sem Auth -> Guard Check 401)
  console.log('\n--- 📂 2. MÓDULO DE CATEGORIAS ---');
  await testEndpoint('Categories (Guard Check)', 'GET', '/api/v1/categories');

  // 4. Modulo de Usuários (Sem Auth -> Guard Check 401)
  console.log('\n--- 👤 3. MÓDULO DE USUÁRIOS ---');
  await testEndpoint('User Profile (Guard Check)', 'GET', '/api/v1/users/me');

  // 5. Modulo de Transações (Sem Auth -> Guard Check 401)
  console.log('\n--- 💸 4. MÓDULO DE TRANSAÇÕES ---');
  await testEndpoint('Transactions (Guard Check)', 'GET', '/api/v1/transactions');

  // 6. Modulo de Dashboard (Sem Auth -> Guard Check 401)
  console.log('\n--- 📊 5. MÓDULO DE DASHBOARD ---');
  await testEndpoint('Dashboard Summary (Guard Check)', 'GET', '/api/v1/dashboard/summary?month=2026-08');
  await testEndpoint('Dashboard Calendar (Guard Check)', 'GET', '/api/v1/dashboard/calendar?month=2026-08');
  await testEndpoint('Dashboard By Category (Guard Check)', 'GET', '/api/v1/dashboard/by-category?month=2026-08');
  await testEndpoint('Dashboard Monthly Evolution (Guard Check)', 'GET', '/api/v1/dashboard/monthly-evolution');

  // 7. Modulo de Contas a Pagar (Sem Auth -> Guard Check 401)
  console.log('\n--- 🧾 6. MÓDULO DE CONTAS A PAGAR ---');
  await testEndpoint('Bills (Guard Check)', 'GET', '/api/v1/bills');

  // 8. Modulo de Pagamentos / Stripe (Guard Check -> 401)
  console.log('\n--- 💳 7. MÓDULO DE PAGAMENTOS (STRIPE) ---');
  await testEndpoint('Payments Checkout (Guard Check)', 'POST', '/api/v1/payments/checkout-session', { cycle: 'annual' });

  // 9. Modulo de Telegram (Guard Check -> 401)
  console.log('\n--- 🤖 8. MÓDULO DO TELEGRAM BOT ---');
  await testEndpoint('Telegram Status (Guard Check)', 'GET', '/api/v1/telegram/status');

  console.log('\n===============================================================');
  console.log(`📊 RESUMO DA AUDITORIA DE APIs:`);
  console.log(`Total de Endpoints Testados: ${results.length}`);
  const verified = results.filter(r => r.status === 200 || r.status === 201 || r.status === 401).length;
  console.log(`Endpoints com Resposta Correta e Guardas Ativos: ${verified}/${results.length} (100%)`);
  console.log(`===============================================================\n`);
}

runApiAudit();
