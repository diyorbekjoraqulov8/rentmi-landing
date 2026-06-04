# rentmi.uz — Client UI

Public-facing SSR web app for **2RentMe (UzRentMe)**, built with Nuxt 4 +
Tailwind CSS 4. Talks to the Django backend's `/api/v1/mobile/` and
`/api/v1/auth/` namespaces.

See [`CLAUDE.md`](./CLAUDE.md) for architecture, conventions, and gotchas.

## Stack

- **Nuxt 4** (Vue 3, SSR, `node-server` preset) — port **4000**
- **Tailwind CSS 4** (CSS-first config, no component library)
- **Axios** — single instance with JWT interceptor + refresh mutex
- **@nuxtjs/seo** — sitemap, robots, og-image, schema.org
- **@nuxtjs/i18n** — uz (default, un-prefixed), ru, en
- **pnpm** package manager

## Setup

```bash
pnpm install
cp .env.example .env   # set NUXT_PUBLIC_SITE_URL / NUXT_PUBLIC_API_BASE
```

## Development

```bash
pnpm dev          # http://localhost:4000
pnpm lint         # eslint
pnpm typecheck    # nuxt typecheck
pnpm test         # vitest
```

## Production

```bash
pnpm build        # → .output/ (node-server)
pnpm preview      # preview the build
```

Deployed as a Docker container behind the outer Nginx at
`uzrentme.powerapp.uz` (prod `rentmi.uz`). Nginx proxies `/api/*` to the
backend — the app does not proxy API calls itself.
