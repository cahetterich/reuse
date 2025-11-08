# ReUse — Inventário do Projeto (Next.js)

Gerado em: 2025-11-02T23:44:25.124Z

## Árvore de pastas (ignora node_modules, .next, dist, build, coverage)
```
reuse-nodefront
├── .env
├── .gitignore
├── docs
│   ├── database.md
│   ├── final.md
│   ├── nextjs.md
│   ├── prisma.md
│   └── README.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── prisma
│   ├── migrations
│   │   ├── 20250909043413_init
│   │   │   └── migration.sql
│   │   ├── 20250915142004_add_item_fields
│   │   │   └── migration.sql
│   │   ├── 20250915191112_add_is_active_field
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   ├── schema.prisma
│   └── seed.js
├── public
│   └── hero.png
├── README.md
├── reuse-inventory.html
├── reuse-inventory.md
├── scripts
│   └── reuse-inventory.mjs
├── src
│   ├── app
│   │   ├── api
│   │   │   ├── auth
│   │   │   │   ├── login
│   │   │   │   │   └── route.ts
│   │   │   │   └── register
│   │   │   │       └── route.ts
│   │   │   ├── config
│   │   │   │   └── flags
│   │   │   │       └── route.ts
│   │   │   ├── content
│   │   │   │   └── promo
│   │   │   │       └── route.ts
│   │   │   ├── items
│   │   │   │   ├── [id]
│   │   │   │   │   ├── edit
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── toggle
│   │   │   │   │       └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── users
│   │   │       └── route.ts
│   │   ├── Chrome.tsx
│   │   ├── components
│   │   │   ├── Navbar.tsx
│   │   │   ├── PromoBannerPro.tsx
│   │   │   ├── PromoRibbon.tsx
│   │   │   ├── TradesBadge.tsx
│   │   │   ├── userNavbar.module.css
│   │   │   └── UserNavbar.tsx
│   │   ├── dashboard
│   │   │   ├── dashboard.module.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── items
│   │   │   ├── [id]
│   │   │   │   └── edit
│   │   │   │       └── page.tsx
│   │   │   ├── my
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── myItems.module.css
│   │   │   │   └── page.tsx
│   │   │   ├── new
│   │   │   │   ├── newItem.module.css
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── login
│   │   │   ├── login.module.css
│   │   │   └── page.tsx
│   │   ├── page.module.css
│   │   ├── page.tsx
│   │   ├── profile
│   │   │   └── page.tsx
│   │   ├── register
│   │   │   ├── page.tsx
│   │   │   └── register.module.css
│   │   └── settings
│   │       └── page.tsx
│   └── lib
│       └── prisma.ts
└── tsconfig.json
```

## Rotas (App Router)
- `/` → `src/app/page.tsx`
- `/dashboard` → `src/app/dashboard/page.tsx`
- `/items` → `src/app/items/page.tsx`
- `/items/[id]/edit` → `src/app/items/[id]/edit/page.tsx`
- `/items/my` → `src/app/items/my/page.tsx`
- `/items/new` → `src/app/items/new/page.tsx`
- `/login` → `src/app/login/page.tsx`
- `/profile` → `src/app/profile/page.tsx`
- `/register` → `src/app/register/page.tsx`
- `/settings` → `src/app/settings/page.tsx`

## Rotas (Pages Router)
_Nenhuma detectada._

## Rotas de API
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/register/route.ts`
- `src/app/api/config/flags/route.ts`
- `src/app/api/content/promo/route.ts`
- `src/app/api/items/[id]/route.ts`
- `src/app/api/items/[id]/toggle/route.ts`
- `src/app/api/items/route.ts`
- `src/app/api/users/route.ts`

## Anomalias em `app/api`
- `src/app/api/items/[id]/edit/page.tsx`

## Arquivos e métricas
| Arquivo | Linhas | Tamanho (bytes) | Título/metadata | Export default |
|---|---:|---:|---|---|
| `docs/database.md` | 48 | 1978 | - | - |
| `docs/final.md` | 150 | 7280 | - | - |
| `docs/nextjs.md` | 93 | 4039 | - | - |
| `docs/prisma.md` | 70 | 2916 | - | - |
| `docs/README.md` | 47 | 2168 | - | - |
| `next-env.d.ts` | 7 | 262 | - | - |
| `next.config.ts` | 8 | 133 | - | - |
| `package-lock.json` | 6059 | 212682 | - | - |
| `package.json` | 34 | 730 | - | - |
| `prisma/seed.js` | 96 | 2504 | - | - |
| `README.md` | 33 | 779 | - | - |
| `reuse-inventory.md` | 187 | 7356 | - | - |
| `src/app/api/auth/login/route.ts` | 50 | 1279 | - | - |
| `src/app/api/auth/register/route.ts` | 39 | 1229 | - | - |
| `src/app/api/config/flags/route.ts` | 14 | 425 | - | - |
| `src/app/api/content/promo/route.ts` | 9 | 275 | - | - |
| `src/app/api/items/[id]/edit/page.tsx` | 192 | 6134 | - | - |
| `src/app/api/items/[id]/route.ts` | 71 | 1859 | - | - |
| `src/app/api/items/[id]/toggle/route.ts` | 30 | 919 | - | - |
| `src/app/api/items/route.ts` | 53 | 1365 | - | - |
| `src/app/api/users/route.ts` | 10 | 250 | - | - |
| `src/app/Chrome.tsx` | 39 | 972 | - | Chrome |
| `src/app/components/Navbar.tsx` | 34 | 838 | - | Navbar |
| `src/app/components/PromoBannerPro.tsx` | 119 | 3714 | - | PromoBannerPro |
| `src/app/components/PromoRibbon.tsx` | 41 | 1046 | - | PromoRibbon |
| `src/app/components/TradesBadge.tsx` | 27 | 939 | - | TradesBadge |
| `src/app/components/userNavbar.module.css` | 106 | 1844 | - | - |
| `src/app/components/UserNavbar.tsx` | 80 | 2392 | - | UserNavbar |
| `src/app/dashboard/dashboard.module.css` | 352 | 6217 | - | - |
| `src/app/dashboard/layout.tsx` | 13 | 412 | - | DashboardLayout |
| `src/app/dashboard/page.tsx` | 308 | 10187 | - | DashboardPage |
| `src/app/globals.css` | 59 | 876 | - | - |
| `src/app/items/[id]/edit/page.tsx` | 136 | 4120 | - | EditItemPage |
| `src/app/items/my/layout.tsx` | 15 | 403 | - | MyItemsLayout |
| `src/app/items/my/myItems.module.css` | 263 | 4477 | - | - |
| `src/app/items/my/page.tsx` | 173 | 5691 | - | MyItemsPage |
| `src/app/items/new/newItem.module.css` | 164 | 2589 | - | - |
| `src/app/items/new/page.tsx` | 266 | 8480 | - | NewItemPage |
| `src/app/items/page.tsx` | 96 | 2865 | - | - |
| `src/app/layout.tsx` | 19 | 683 | ReUse! - Web | RootLayout |
| `src/app/login/login.module.css` | 98 | 1598 | - | - |
| `src/app/login/page.tsx` | 101 | 2924 | - | LoginPage |
| `src/app/page.module.css` | 120 | 1679 | - | - |
| `src/app/page.tsx` | 64 | 2255 | - | Home |
| `src/app/profile/page.tsx` | 0 | 0 | - | - |
| `src/app/register/page.tsx` | 135 | 4025 | - | RegisterPage |
| `src/app/register/register.module.css` | 122 | 1962 | - | - |
| `src/app/settings/page.tsx` | 0 | 0 | - | - |
| `src/lib/prisma.ts` | 13 | 327 | - | - |
| `tsconfig.json` | 28 | 620 | - | - |
