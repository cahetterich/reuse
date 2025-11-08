# ReUse! – Web (Next.js)

Aplicação **Next.js** da plataforma **ReUse!**.  
Integra com o **painel administrativo em Node-RED** para exibir:

- **Promoção dinâmica** (banner “bem-vindo”: desconto % ou frete grátis acima de R$ X).
- **Feature flag de Trocas** (badge “Trocas ativas”).

> Este repositório contém **somente o frontend**. O painel/admin Node-RED fica em um repositório separado.

---

## Requisitos

- **Node.js 18+**
- **npm** (ou pnpm/yarn)
- **Node-RED** rodando localmente para dados reais do painel

---

## Rodando em desenvolvimento

```bash
# 1) Instalar dependências
npm install

# 2) Copiar variáveis de exemplo (se existir um .env.example)
# cp .env.example .env

# 3) Rodar o servidor Next.js
npm run dev
# ➜ http://localhost:3000
