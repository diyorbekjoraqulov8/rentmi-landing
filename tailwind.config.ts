import type { Config } from 'tailwindcss'

/**
 * Tailwind CSS 4 is configured CSS-first — the source of truth for theme
 * tokens (colors, fonts, radii, shadows) is `app/assets/css/main.css` via the
 * `@theme` block. This file is intentionally minimal: it only declares content
 * sources so editor IntelliSense and class scanning resolve correctly across
 * the Nuxt 4 `app/` layout. Do NOT duplicate the palette here — edit main.css.
 */
export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/app.vue',
    './app/**/*.{vue,js,ts}'
  ]
} satisfies Config
