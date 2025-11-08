Prisma ORM — Aplicação no Projeto

O que é o Prisma

- É a camada que liga o código ao banco PostgreSQL de forma segura e tipada.
- Os modelos (tabelas) ficam descritos em `01/reuse-web/prisma/schema.prisma` e, a partir deles, o Prisma gera um cliente para acessar o banco.

Onde o Prisma é usado hoje

Cadastro de usuário

- Rota: `POST /api/auth/register`
- Arquivo: `01/reuse-web/src/app/api/auth/register/route.ts`
- Fluxo explicado:
  - Recebe `name`, `email`, `password` do formulário de cadastro.
  - Verifica se já existe usuário com o mesmo e‑mail (`prisma.user.findUnique`).
  - Criptografa a senha com `bcrypt`.
  - Cria o usuário (`prisma.user.create`) e retorna dados sem a senha.

Login de usuário

- Rota: `POST /api/auth/login`
- Arquivo: `01/reuse-web/src/app/api/auth/login/route.ts`
- Fluxo explicado:
  - Recebe `email` e `password` do formulário de login.
  - Busca o usuário pelo e‑mail (`prisma.user.findUnique`).
  - Compara a senha informada com o hash salvo (`bcrypt.compare`).
  - Em sucesso, confirma o login e retorna dados básicos do usuário (sem a senha).

Configuração e comandos úteis

- Variável de ambiente: `DATABASE_URL` (no `.env`). Ex.: URL do Neon (PostgreSQL em nuvem).
- Gerar cliente Prisma: `npx prisma generate` (após alterar o schema).
- Criar/aplicar migrações: `npx prisma migrate dev` (cria histórico em `prisma/migrations`).
- Semente (opcional): `npm run seed` (se existir arquivo de seed).

Arquivos relevantes

- Schema: `01/reuse-web/prisma/schema.prisma`
- Migrations: `01/reuse-web/prisma/migrations/`
- API Cadastro: `01/reuse-web/src/app/api/auth/register/route.ts`
- API Login: `01/reuse-web/src/app/api/auth/login/route.ts`
 
Itens (CRUD via API)

- Listar/criar itens — `GET` e `POST` em `/api/items`
  - Arquivo: `01/reuse-web/src/app/api/items/route.ts`
  - `GET`: retorna itens (filtra por `userId` via query, se informado).
  - `POST`: cria item com campos: `title`, `description`, `category`, `price?`, `imageUrl?`, `userId`.

- Ler/atualizar/excluir item — `GET`, `PUT`, `DELETE` em `/api/items/[id]`
  - Arquivo: `01/reuse-web/src/app/api/items/[id]/route.ts`
  - `GET`: retorna um item pelo `id`.
  - `PUT`: atualiza campos do item (`title`, `description`, `category`, `price?`, `imageUrl?`, `status?`).
  - `DELETE`: remove o item.

- Alternar disponibilidade — `PUT` em `/api/items/[id]/toggle`
  - Arquivo: `01/reuse-web/src/app/api/items/[id]/toggle/route.ts`
  - Objetivo: inverte o campo booleano `isActive` do item (ativo/inativo).

Usuários (API)

- Listar/criar usuários — `GET` e `POST` em `/api/users`
  - Arquivo: `01/reuse-web/src/app/api/users/route.ts`
  - Objetivo: operações administrativas ou futuras integrações (em construção). Quando implementado, deve respeitar regras de segurança e não expor senhas.

Links

- Código integrado (Next.js + Prisma): INSERIR_LINK_GITHUB_PRISMA
