import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxtjs/seo'
  ],

  ssr: true,

  devtools: {
    enabled: process.env.NODE_ENV !== 'production'
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/favicon.svg' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  // @nuxtjs/seo — site identity drives sitemap, robots, og-image, schema.org.
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:4000',
    name: 'rentmi.uz',
    defaultLocale: 'uz'
  },

  runtimeConfig: {
    public: {
      // Site origin (used by @nuxtjs/seo, canonical URLs).
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:4000',
      // Backend API base. In production the outer Nginx proxies /api/* to
      // Django, so the default is same-origin `/api/v1`. Override per-env.
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api/v1'
    }
  },

  devServer: {
    port: 4000
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    // Default to the standalone Node server (Docker / behind Nginx).
    // On Netlify, `NITRO_PRESET=netlify` (set in netlify.toml) overrides this.
    preset: process.env.NITRO_PRESET || 'node-server'
  },

  // Tailwind CSS 4 — configured via CSS (@import "tailwindcss"), wired
  // into Vite. No JS tailwind.config; theme tokens live in main.css.
  vite: {
    plugins: [tailwindcss()]
  },

  eslint: {
    config: {
      stylistic: true
    }
  },

  i18n: {
    locales: [
      { code: 'uz', name: 'O\'zbekcha', language: 'uz-UZ', file: 'uz.json' },
      { code: 'ru', name: 'Русский', language: 'ru-RU', file: 'ru.json' },
      { code: 'en', name: 'English', language: 'en-US', file: 'en.json' }
    ],
    defaultLocale: 'uz',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'app-locale',
      redirectOn: 'root'
    }
  },

  // The default icon endpoint is `/api/_nuxt_icon`, but in production the outer
  // Nginx proxies all `/api/*` to the Django backend (404 for icon sets). Move
  // it outside `/api` and bundle scanned icons so they render with no round trip.
  icon: {
    localApiEndpoint: '/_nuxt_icon',
    clientBundle: {
      scan: true,
      sizeLimitKb: 512
    }
  },

  image: {
    format: ['svg', 'webp'],
    provider: 'ipx',
    ipx: {
      maxAge: 31536000
    }
  }
})
