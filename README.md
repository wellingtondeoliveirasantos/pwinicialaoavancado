# pwinicialaoavancado

Projeto de automação de testes utilizando [Playwright](https://playwright.dev/).

## Pré-requisitos

- Node.js (versão recomendada: 18+)
- npm

## Instalação

```bash
npm install
```

## Executando os testes

- Todos os testes:
  ```bash
  npx playwright test
  ```

- Testes por tag:
  ```bash
  npm run SmokeTesting
  npm run RegressionTesting
  npm run DataDrivenTesting
  ```

## Relatórios

- Relatório HTML:
  ```bash
  npx playwright show-report
  ```
- Relatório Allure:
  ```bash
  npx allure generate ./allure-results --clean && npx allure open
  ```

## Estrutura do Projeto

- `tests/` - Scripts de teste
- `playwright.config.ts` - Configuração do Playwright
- `.env` - Variáveis de ambiente

## Scripts úteis

Veja todos os scripts disponíveis em `package.json`.

---

> Projeto para estudos e demonstração de automação de testes com Playwright.