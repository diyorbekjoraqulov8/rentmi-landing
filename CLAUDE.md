# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Status: greenfield.** This directory is a planned ground-up rewrite of the old
> `../client-ui/` (a Nuxt UI landing template). No application code exists yet — only this
> file and `.idea/`. The sections below define the **target** stack, conventions, and
> architecture decided up front. As code lands, keep this file in sync with reality.

## What this is

The public-facing client web app for **2RentMe (UzRentMe)** — see the workspace-root
`../CLAUDE.md` for the cross-project picture (backend, admin-ui, mobile, devops-infra). This
app is the SSR website tenants/homeowners/realtors use to browse announcements, send rental
requests, sign contracts, and chat. In production it is served at `uzrentme.powerapp.uz`
(prod domain `rentmi.uz`) as a Nuxt SSR Node server.

Unlike the old `client-ui/` (which was mostly a marketing landing page), this rewrite is a
full application talking to the Django backend's **`/api/v1/mobile/`** and
**`/api/v1/auth/`** namespaces (the client is treated as a "mobile" API consumer — there is
no separate `client` namespace). **Never call `/api/v1/admin/`** from here.

## Stack (target)

| Concern | Choice | Notes |
|---------|--------|-------|
| Framework | **Nuxt 4** (Vue 3, SSR) | `nitro` preset `node-server`; runs on **port 4000** |
| Styling | **Tailwind CSS 4** only | No component library (Nuxt UI was dropped). Build UI from Tailwind utilities + own components. |
| HTTP | **Axios** via Nuxt plugin | Single instance, JWT interceptor + refresh mutex. See "API layer" below. |
| SEO | **@nuxtjs/seo** | sitemap, robots, og-image, schema.org, link-checker. SSR-first. |
| i18n | **@nuxtjs/i18n** | `uz` (default), `ru`, `en`. `prefix_except_default` strategy, cookie `app-locale`. |
| Package manager | **pnpm** | `shamefully-hoist=true` in `.npmrc`. |
| Tests | **Vitest** + `@nuxt/test-utils` + happy-dom | |
| Lint/format | **@nuxt/eslint** (stylistic) + Prettier | |

Match these versions to the latest stable at scaffold time; the old `../client-ui/package.json`
is the reference baseline (Nuxt 4.2, Tailwind 4.1, i18n 10, pnpm 10).

## Commands

```bash
pnpm install
pnpm dev          # Nuxt dev server on http://localhost:4000
pnpm build        # production build (.output/, node-server preset)
pnpm preview      # preview the production build locally
pnpm lint         # eslint .
pnpm typecheck    # nuxt typecheck (vue-tsc)
pnpm test         # vitest run (all)
pnpm test:watch   # vitest watch

# run a single test file / pattern
pnpm vitest run app/tests/path/to/file.test.ts
pnpm vitest run -t "name of the test"
```

## Architecture & conventions

### Directory layout (Nuxt 4 `app/` srcDir)
Nuxt 4 puts source under `app/`. Expected shape:

```
app/
  pages/         # file-based routes (i18n-prefixed automatically)
  components/     # auto-imported Vue components
  composables/    # auto-imported useXxx() — API calls, shared state
  plugins/        # axios.ts (the API client), other client/server plugins
  middleware/     # route guards (e.g. auth)
  layouts/
  assets/css/main.css   # Tailwind 4 entry (@import "tailwindcss")
i18n/locales/      # uz.json (default), ru.json, en.json
server/            # Nitro server routes if any BFF logic is needed
public/
```

### API layer (the most important convention)
All backend communication goes through **one axios instance** created in `app/plugins/axios.ts`
and exposed (e.g. via `nuxtApp.provide('api', instance)` and/or a `useApi()` composable).
Do **not** scatter raw `axios`/`$fetch` calls across components.

- `baseURL` comes from `runtimeConfig` (public), driven by env. In production the **outer
  Nginx** proxies `/api/*` to the Django backend — the app itself does not proxy. So the
  base is the site origin + `/api/v1/`, not a hardcoded host.
- **Auth is OTP → JWT** (phone → SMS code → access/refresh tokens). The request interceptor
  attaches the access token; the response interceptor catches `401`, refreshes once, and
  retries — using a **single shared refresh promise (mutex)** so concurrent 401s trigger only
  one refresh. **Never add a second/parallel refresh path** — this rule holds across all
  RentMe clients (see `../CLAUDE.md`).
- SSR caveat: tokens live in cookies (use `useCookie`) so the same axios instance works
  during server render and on the client. Be careful not to leak one user's token across
  SSR requests — read the token per-request, never module-level.

### Backend contract reminders
- **Namespaces:** use only `/api/v1/mobile/` and `/api/v1/auth/`. Never `/api/v1/admin/`.
- **Pagination:** `page` / `page_size` query params (not `offset`/`size`).
- **URLs:** kebab-case, plural nouns, trailing slashes — `/api/v1/mobile/rental-requests/`.
- **Soft-delete:** backend already filters `is_deleted=False`; the client just consumes results.
- Domain flow: `Property → PropertyAnnouncement (moderated) → RentalRequest → PropertyContract → ChatRoom → FCM notifications`.

### SEO (@nuxtjs/seo)
- Drive per-page meta with `useSeoMeta`; set canonical/OG/Twitter and JSON-LD (`useSchemaOrg`)
  for property/announcement pages — these are the pages that matter for search.
- Configure `site` (url, name, defaultLocale) in `nuxt.config`. Sitemap & robots come from the
  module; expose dynamic announcement URLs to the sitemap via a server source if needed.
- i18n + SEO: emit `hreflang` alternates for uz/ru/en. The default locale (`uz`) is
  un-prefixed (`prefix_except_default`); keep canonical URLs consistent with that.

### i18n
- Three locales, **uz is the default and un-prefixed**; `ru`/`en` are prefixed (`/ru/...`, `/en/...`).
- Locale persisted in cookie `app-locale`, browser detection redirects on root only.
- Translation files in `i18n/locales/*.json`. Keep keys identical across the three files.

### Styling (Tailwind 4)
- Tailwind 4 is configured via CSS (`@import "tailwindcss"` + `@theme`), not a large JS config.
  Avoid reintroducing a heavy `tailwind.config` unless a plugin requires it.
- No Nuxt UI / no third-party component lib — build components from utilities. Keep shared
  primitives (Button, Input, Modal) in `app/components/` and reuse them.

## Deployment

Built with the `node-server` Nitro preset → Docker image → runs behind the outer Nginx as the
`uzrentme.powerapp.uz` service (see `../devops-infra/docker-compose.admin.yml`, prod server 2).
The app does **not** route `/api/` itself in production. Env: `NUXT_PUBLIC_SITE_URL`
(prod `https://rentmi.uz`, staging `https://uzrentme.powerapp.uz`). CI/CD is GitLab CI,
`staging` → `main` strategy, feature branches `feature/<desc>` targeting `staging`.

## Gotchas carried over from the old client-ui
- **`@nuxt/image` IPX vs Nginx `/api/*` proxy:** if using `@nuxt/icon`/`@nuxt/image`, the
  default icon endpoint `/api/_nuxt_icon` collides with the backend `/api/*` proxy (returns
  404 in prod). Move it outside `/api` (`localApiEndpoint: '/_nuxt_icon'`) and bundle icons
  client-side. Apply the same care to any IPX `/api`-prefixed route.
- Keep `.npmrc` `shamefully-hoist=true` — some deps (sharp, better-sqlite3) need explicit
  `onlyBuiltDependencies`.
