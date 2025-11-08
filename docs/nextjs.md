Desenvolvimento com Next.js — Telas e Objetivos

Resumo

- O Next.js organiza as páginas pela pasta `app/`. Cada subpasta com `page.tsx` vira uma rota no site.
- A navegação principal está na `Navbar`, visível nas páginas principais.

Telas desenvolvidas

Home (`/`)

- O que é: a página inicial do ReUse!, que apresenta a proposta do projeto.
- Objetivo: convidar o usuário a criar conta ou explorar itens.
- Elementos: título, texto de apresentação, botões “Criar conta” e “Explorar Produtos”, e uma ilustração.
- Arquivo: `01/reuse-web/src/app/page.tsx`
- Print sugerido: `docs/prints/home.png`

Login (`/login`)

- O que é: página para quem já tem cadastro acessar sua conta.
- Objetivo: autenticar com e‑mail e senha.
- Comportamento: se os dados estiverem incorretos, aparece mensagem de erro; se estiverem corretos, o login é confirmado e o usuário é direcionado para a área interna (ex.: Dashboard).
- Arquivo: `01/reuse-web/src/app/login/page.tsx`
- Usa a API: `POST /api/auth/login` (ver detalhes em `docs/prisma.md`).
- Print sugerido: `docs/prints/login.png`

Cadastro (`/register`)

- O que é: página para criar uma nova conta.
- Objetivo: registrar nome, e‑mail e senha do usuário.
- Comportamento: validação do formulário (senhas iguais) e garantia de e‑mail único. Em sucesso, o usuário é direcionado à área interna (ex.: Dashboard).
- Arquivo: `01/reuse-web/src/app/register/page.tsx`
- Usa a API: `POST /api/auth/register` (ver detalhes em `docs/prisma.md`).
- Print sugerido: `docs/prints/register.png`

Navbar (menu superior)

- O que é: barra de navegação presente nas páginas principais.
- Objetivo: facilitar o acesso rápido a Home, Login e Cadastro (podem existir outras entradas conforme o projeto evolui).
- Arquivo: `01/reuse-web/src/app/components/Navbar.tsx`
- Print sugerido: `docs/prints/navbar.png`

Notas técnicas (simples)

- Componentes com interatividade (formularios, botões e hooks do React) são marcados com `'use client'` no topo do arquivo.
- Os botões e links usam `next/link` para navegar entre páginas sem recarregar o site.
- Os estilos das páginas de Login e Cadastro usam CSS Modules (`.module.css`) para manter estilos isolados.

Novas telas/rotas

Dashboard (`/dashboard`)

- O que é: área interna para o usuário acompanhar seus itens e atalhos (em construção).
- Objetivo: resumir itens cadastrados e permitir ações rápidas (ativar/desativar, editar, excluir) quando implementadas.
- Arquivo: `01/reuse-web/src/app/dashboard/page.tsx`
- Print sugerido: `docs/prints/dashboard.png`

Items — listagem (`/items`)

- O que é: lista de itens disponíveis na plataforma.
- Objetivo: apresentar itens com título, descrição e outras informações.
- Arquivo: `01/reuse-web/src/app/items/page.tsx`
- Print sugerido: `docs/prints/items-list.png`

Items — novo (`/items/new`)

- O que é: formulário para cadastrar um novo item.
- Objetivo: permitir que o usuário crie um item informando título, descrição, categoria, preço (opcional) e imagem (opcional).
- Arquivo: `01/reuse-web/src/app/items/new/page.tsx`
- Observação técnica: página interativa (usa formulário e chamadas à API).
- Print sugerido: `docs/prints/items-new.png`

Items — editar (`/items/[id]/edit`)

- O que é: formulário para editar um item existente.
- Objetivo: atualizar dados do item (título, descrição, categoria, preço, imagem e status).
- Arquivo: `01/reuse-web/src/app/items/[id]/edit/page.tsx`
- Print sugerido: `docs/prints/items-edit.png`

Profile (`/profile`)

- O que é: página de perfil do usuário (em construção).
- Objetivo: exibir/editar dados básicos do usuário autenticado.
- Arquivo: `01/reuse-web/src/app/profile/page.tsx`
- Print sugerido: `docs/prints/profile.png`

Settings (`/settings`)

- O que é: página de configurações (em construção).
- Objetivo: ajustar preferências da conta e do aplicativo.
- Arquivo: `01/reuse-web/src/app/settings/page.tsx`
- Print sugerido: `docs/prints/settings.png`
