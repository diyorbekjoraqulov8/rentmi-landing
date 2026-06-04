<script setup lang="ts">
/** Floating "AI maslahat" card shown around the hero phone. */
const { t } = useI18n()
</script>

<template>
  <div class="rounded-2xl bg-surface p-4 shadow-card">
    <div class="flex items-center justify-between">
      <span class="font-semibold text-neutral-900">{{ t('landing.hero.cards.aiAdvice.title') }}</span>
      <IconsSparkle class="size-5 text-brand-600" />
    </div>
    <div
      class="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-600"
    >
      {{ t('landing.hero.cards.aiAdvice.action') }}
      <IconsSparkle class="size-4 text-brand-600" />
    </div>
  </div>
</template>
