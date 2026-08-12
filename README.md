# 🧪 Economize Já - Suíte de Testes Automatizados E2E & API

Repositório dedicado para testes automatizados End-to-End (E2E) e de integração de API do **Economize Já**, utilizando **Playwright** e **GitHub Actions**.

---

## 🚀 Como Executar Localmente

### 1. Instalar as dependências
```bash
npm install
npx playwright install
```

### 2. Rodar todos os testes
```bash
npm test
```

### 3. Rodar apenas no Chromium
```bash
npm run test:chromium
```

### 4. Abrir a Interface Gráfica Interativa do Playwright
```bash
npm run test:ui
```

### 5. Abrir o Relatório HTML dos Resultados
```bash
npm run test:report
```

---

## ⚙️ CI/CD Pipeline (GitHub Actions)

A pipeline automatizada está configurada no arquivo `.github/workflows/e2e-tests.yml`.

### Como ativar no seu GitHub:
1. Crie um novo repositório no GitHub (ex: `economize-ja-e2e-tests`).
2. Vincule e envie o código deste repositório local:
   ```bash
   git init
   git add .
   git commit -m "feat: initial playwright e2e setup"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/economize-ja-e2e-tests.git
   git push -u origin main
   ```
3. Na aba **Actions** do seu repositório no GitHub, você verá a execução automática e o **Resumo Executivo (Job Summary)** com relatórios de aprovação e vídeos de falhas.
