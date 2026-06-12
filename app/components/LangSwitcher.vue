<script setup lang="ts">
/**
 * Locale switcher — segmented pills showing all locales with the active one
 * highlighted, so the current language is always visible (used in the nav
 * drawer's bottom block).
 */
const { t, locale, locales, setLocale } = useI18n()

const items = computed(
  () => locales.value as { code: 'uz' | 'ru' | 'en', name: string }[]
)
</script>

<template>
  <div
    class="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-background p-1"
    role="group"
    :aria-label="t('header.language')"
  >
    <button
      v-for="l in items"
      :key="l.code"
      type="button"
      class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
      :class="l.code === locale
        ? 'bg-surface text-neutral-900 shadow-sm'
        : 'text-neutral-500 hover:text-neutral-900'"
      :lang="l.code"
      :aria-pressed="l.code === locale"
      @click="setLocale(l.code)"
    >
      {{ l.name }}
    </button>
  </div>
</template>
