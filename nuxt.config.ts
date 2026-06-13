import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/google-fonts',
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
        { rel: 'icon', type: 'image/svg+xml', href: '/landing/logo.svg' },
        { rel: 'apple-touch-icon', href: '/landing/logo.svg' }
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
      // Backend API base — same-origin everywhere: the browser always calls
      // `<site>/api/v1/...` and the server in front proxies to the backend
      // (the Nitro routeRules proxy below in dev/Netlify, the outer Nginx in
      // prod). The backend sends no CORS headers, so cross-origin calls are
      // impossible — never point this at the backend host directly.
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api/v1'
    }
  },

  devServer: {
    port: 4000
  },

  compatibilityDate: '2025-01-15',

  // Standalone Node server (Docker / behind Nginx); Netlify overrides via
  // NITRO_PRESET=netlify. Compress static assets and cache hashed output hard.
  nitro: {
    preset: process.env.NITRO_PRESET || 'node-server',
    compressPublicAssets: { gzip: true, brotli: true },
    routeRules: {
      // Same-origin /api/v1/* → backend, server-side (no browser CORS). Works
      // in dev and on Netlify (the SSR function proxies); on prod Nginx the
      // outer /api/* proxy catches these before they reach the app. The
      // backend WAF drops non-browser UAs, but the proxy forwards the
      // original browser headers, so real traffic passes.
      '/api/v1/**': { proxy: 'https://rentmi.uz/api/v1/**' },
      '/_ipx/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } }
    }
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

  googleFonts: {
    families: {
      'Public Sans': [400, 500, 600, 700, 800]
    },
    display: 'swap',
    download: true,
    preload: false,
    subsets: ['latin', 'latin-ext', 'cyrillic']
  },

  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:4000',
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

  icon: {
    localApiEndpoint: '/_nuxt_icon',
    clientBundle: {
      scan: true,
      sizeLimitKb: 512
    }
  },

  image: {
    format: ['avif', 'webp'],
    quality: 72,
    // IPX (the `/_ipx/**` route) only exists on the node-server preset. On
    // Netlify the SSR app runs as a function and that route is never wired up,
    // so every <NuxtImg> 404s — use Netlify's built-in Image CDN there instead.
    provider:
      process.env.NITRO_PRESET === 'netlify' ? 'netlifyImageCdn' : 'ipx',
    densities: [1, 2],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    },
    ipx: {
      maxAge: 31536000
    }
  }
})
