Documentação Parcial – Projeto ReUse!

Visão geral

- O ReUse! é uma plataforma web criada com Next.js, Prisma ORM e PostgreSQL (Neon) para facilitar doações, trocas e vendas responsáveis de itens.
- Esta documentação descreve, em linguagem simples, as telas já desenvolvidas (Home, Login, Cadastro e Navbar), como o Prisma é usado e quais tabelas existem no banco.

Como rodar o projeto (resumo)

- Pré‑requisitos: Node.js e um banco PostgreSQL (Neon ou local).
- Variáveis: criar um arquivo `.env` com `DATABASE_URL="postgresql://..."`.
- Comandos (na pasta `01/reuse-web/`):
  - `npm install`
  - `npm run dev`
  - (Banco) `npx prisma migrate dev` e `npx prisma generate` quando alterar o schema.

Links úteis

- Repositório Next.js (código do app): INSERIR_LINK_GITHUB_NEXT
- Repositório Next.js + Prisma (pode ser o mesmo): INSERIR_LINK_GITHUB_PRISMA

Documentos desta pasta

- `docs/nextjs.md`: telas (Home, Login, Cadastro, Navbar) e seus objetivos.
- `docs/prisma.md`: onde e como o Prisma é aplicado nas telas.
- `docs/database.md`: tabelas do banco (User e Item) e para que servem.

Locais relevantes no código

- Home: `01/reuse-web/src/app/page.tsx`
- Login: `01/reuse-web/src/app/login/page.tsx`
- Cadastro: `01/reuse-web/src/app/register/page.tsx`
- Navbar: `01/reuse-web/src/app/components/Navbar.tsx`
- Dashboard: `01/reuse-web/src/app/dashboard/page.tsx`
- Itens (lista): `01/reuse-web/src/app/items/page.tsx`
- Itens (novo): `01/reuse-web/src/app/items/new/page.tsx`
- Itens (editar): `01/reuse-web/src/app/items/[id]/edit/page.tsx`
- Profile: `01/reuse-web/src/app/profile/page.tsx`
- Settings: `01/reuse-web/src/app/settings/page.tsx`
- API Login: `01/reuse-web/src/app/api/auth/login/route.ts`
- API Cadastro: `01/reuse-web/src/app/api/auth/register/route.ts`
- API Itens (lista/criação): `01/reuse-web/src/app/api/items/route.ts`
- API Item (detalhe/edição/exclusão): `01/reuse-web/src/app/api/items/[id]/route.ts`
- API Alternar item (ativo/inativo): `01/reuse-web/src/app/api/items/[id]/toggle/route.ts`
- API Usuários: `01/reuse-web/src/app/api/users/route.ts`
- Schema Prisma: `01/reuse-web/prisma/schema.prisma`
