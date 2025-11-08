Documentação Parcial – Projeto ReUse! (final)

1. Introdução

O ReUse! é uma plataforma web desenvolvida com Next.js, Prisma ORM e PostgreSQL (Neon).
O objetivo é criar um espaço digital onde os usuários possam se cadastrar, fazer login e gerenciar itens que desejam doar, trocar ou vender.
O projeto está sendo construído com foco em simplicidade, acessibilidade e sustentabilidade, sempre garantindo legibilidade e boa experiência de uso.

2. Desenvolvimento com Next.js

O Next.js é o framework usado para criar as páginas do projeto. Ele organiza as páginas pela pasta `app/`. Cada subpasta com `page.tsx` vira uma rota no site.

Telas desenvolvidas:

2.1 Home

Página inicial que apresenta a proposta do ReUse! e convida o usuário a se cadastrar ou explorar itens.
Ela possui um texto de apresentação, botões de “Criar conta” e “Explorar Produtos”, além de uma ilustração que reforça o conceito de reutilização.
Arquivo: `01/reuse-web/src/app/page.tsx`

2.2 Navbar

Menu de navegação presente nas páginas principais, permitindo acesso rápido a Home, Itens, Login e Registrar.
Arquivo: `01/reuse-web/src/app/components/Navbar.tsx`

2.3 Cadastro

Página que permite a criação de uma nova conta.
O usuário preenche nome, e-mail, senha e confirmação de senha. O sistema valida os dados e não permite cadastrar um e‑mail já existente.
Arquivo: `01/reuse-web/src/app/register/page.tsx`

2.4 Login

Página que permite o usuário entrar com seu e‑mail e senha já cadastrados.
Caso as informações estejam incorretas, aparece uma mensagem de erro. Se estiverem corretas, o usuário é autenticado e pode ser direcionado ao Dashboard.
Arquivo: `01/reuse-web/src/app/login/page.tsx`

2.5 Dashboard

Área interna (em evolução) para o usuário visualizar um resumo dos seus itens e atalhos de ações (ativar/desativar, editar, excluir) quando disponíveis.
Arquivo: `01/reuse-web/src/app/dashboard/page.tsx`

2.6 Itens

2.6.1 Listagem de itens: lista os itens disponíveis na plataforma.
Arquivo: `01/reuse-web/src/app/items/page.tsx`

2.6.2 Novo item: formulário para cadastrar um novo item com título, descrição, categoria e, opcionalmente, preço e imagem.
Arquivo: `01/reuse-web/src/app/items/new/page.tsx`

2.6.3 Editar item: formulário para atualizar os dados de um item existente.
Arquivo: `01/reuse-web/src/app/items/[id]/edit/page.tsx`

Observação técnica simples: páginas com formulários e interatividade usam `'use client'` no topo do arquivo.

Todo esse desenvolvimento está disponível no repositório do GitHub:
LINK_GITHUB_NEXT: [INSERIR O LINK AQUI]

3. Prisma ORM

O Prisma ORM é responsável por conectar nosso código às tabelas do banco de dados. É a camada que liga o código ao PostgreSQL de forma segura e tipada. Os modelos ficam em `01/reuse-web/prisma/schema.prisma` e as rotas de API usam o cliente Prisma para criar, buscar e atualizar dados.

Onde o Prisma é usado:

3.1 Cadastro

O Prisma salva no banco as informações de nome, e‑mail e senha (esta última criptografada com bcrypt).
Antes de criar um usuário, ele verifica se já existe outro com o mesmo e‑mail.
Rota: `POST /api/auth/register`
Arquivo: `01/reuse-web/src/app/api/auth/register/route.ts`
Fluxo explicado:
- Recebe `name`, `email`, `password` do formulário de cadastro.
- Verifica se já existe usuário com o mesmo e‑mail (`prisma.user.findUnique`).
- Criptografa a senha com `bcrypt`.
- Cria o usuário (`prisma.user.create`) e retorna dados sem a senha.

3.2 Login

O Prisma busca no banco um usuário com o e‑mail digitado.
Caso encontre, compara a senha digitada com a senha salva (usando bcrypt).
Se os dados estiverem corretos, retorna uma mensagem de sucesso; caso contrário, informa o erro.
Rota: `POST /api/auth/login`
Arquivo: `01/reuse-web/src/app/api/auth/login/route.ts`
Fluxo explicado:
- Recebe `email` e `password` do formulário de login.
- Busca o usuário pelo e‑mail (`prisma.user.findUnique`).
- Compara a senha informada com o hash salvo (`bcrypt.compare`).
- Em sucesso, confirma o login e retorna dados básicos do usuário (sem a senha).

3.3 Itens (CRUD)

- Listar/criar itens — `GET` e `POST` em `/api/items`
  - Arquivo: `01/reuse-web/src/app/api/items/route.ts`
  - `GET`: retorna itens; aceita filtro por `userId` via query.
  - `POST`: cria item com `title`, `description`, `category`, e opcionalmente `price` e `imageUrl`, associando ao `userId` do dono.

- Detalhar/atualizar/excluir item — `GET`, `PUT`, `DELETE` em `/api/items/[id]`
  - Arquivo: `01/reuse-web/src/app/api/items/[id]/route.ts`
  - `GET`: retorna um item pelo `id`.
  - `PUT`: atualiza campos do item (título, descrição, categoria, preço, imagem e status).
  - `DELETE`: remove o item pelo `id`.

- Alternar disponibilidade — `PUT` em `/api/items/[id]/toggle`
  - Arquivo: `01/reuse-web/src/app/api/items/[id]/toggle/route.ts`
  - Objetivo: inverte o campo booleano `isActive` (ativo/inativo).

O código de integração com o Prisma também está no repositório do GitHub:
LINK_GITHUB_PRISMA: [INSERIR O LINK AQUI]

4. Banco de Dados

O banco utilizado é o PostgreSQL (servidor hospedado no Neon). As tabelas e relações estão no arquivo `01/reuse-web/prisma/schema.prisma`.

Tabelas utilizadas:

4.1 User (Usuário)

Objetivo: armazenar as contas dos usuários do ReUse!.
Campos principais:
- `id` (número, auto‑incremento): identificador único.
- `name` (texto): nome completo.
- `email` (texto, único): usado para login; não pode se repetir.
- `password` (texto): senha criptografada (hash), nunca em texto puro.
Relações: um usuário pode ter vários itens (`items`).

4.2 Item (Objeto)

Objetivo: representar um item anunciado pelo usuário (para doar, trocar ou vender).
Campos principais:
- `id` (número, auto‑incremento): identificador único do item.
- `title` (texto): título do item.
- `description` (texto): descrição do item.
- `category` (texto): categoria do item (ex.: Eletrônicos, Roupas, Livros).
- `imageUrl` (texto, opcional): link para imagem ilustrativa.
- `price` (número, opcional): preço sugerido (pode ser nulo para doação/troca).
- `status` (texto, default "disponível"): estado do item (ex.: disponível, reservado, trocado/vendido).
- `trade` (booleano, default `false`): indica se o item está marcado para troca.
- `isActive` (booleano, default `true`): controla se o item aparece nas listagens.
- `createdAt` (data/hora): quando o item foi criado (preenchido automaticamente).
- `userId` (número): referência ao usuário dono do item.
Relações: pertence a um `User` (`user`).

Essas tabelas já permitem a gestão de usuários e itens, que são a base da plataforma.

5. Conclusão

Nesta etapa, estruturamos o núcleo do projeto ReUse!, com as páginas de Home, Login e Cadastro, além da Navbar de navegação. Também conectamos o sistema ao banco de dados usando o Prisma ORM e ampliamos o escopo com rotas e APIs de Itens (listagem, criação, edição, exclusão e alternância de disponibilidade) e a página de Dashboard em evolução.
Esse é o alicerce que garante tanto a parte visual quanto a parte funcional do projeto, permitindo avançar para melhorias no Dashboard, CRUD completo de itens e outras funcionalidades.

