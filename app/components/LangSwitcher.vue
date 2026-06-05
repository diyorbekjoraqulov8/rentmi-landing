<script setup lang="ts">
const { t, locale, locales, setLocale } = useI18n()

const available = computed(() =>
  (locales.value as { code: string, name: string }[]).filter(
    l => l.code !== locale.value
  )
)
</script>

<template>
  <div
    class="flex items-center gap-2 text-sm"
    role="group"
    :aria-label="t('header.language')"
  >
    <button
      v-for="l in available"
      :key="l.code"
      class="text-neutral-600 hover:text-brand-600 transition-colors"
      type="button"
      :lang="l.code"
      :aria-label="l.name"
      @click="setLocale(l.code as 'uz' | 'ru' | 'en')"
    >
      {{ l.name }}
    </button>
  </div>
</template>
