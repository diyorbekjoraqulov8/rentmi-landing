<script setup lang="ts">
/**
 * Floating "Ko'chmas mulk turi" (property type) card on the tenant hero.
 * A wrapping set of selectable pills; the design shows two pre-selected
 * (apartment + duplex) in solid brand, the rest as outline pills.
 */
const { t } = useI18n()

const types = [
  { key: 'apartment', active: true },
  { key: 'house', active: false },
  { key: 'studio', active: false },
  { key: 'duplex', active: true },
  { key: 'penthouse', active: false },
  { key: 'cottage', active: false },
  { key: 'townhouse', active: false }
] as const
</script>

<template>
  <div class="rounded-2xl bg-surface p-4 shadow-card w-full">
    <p class="font-semibold text-neutral-900">
      {{ t('landing.hero.cards.propertyType.title') }}
    </p>
    <div class="mt-3 flex flex-wrap gap-2">
      <span
        v-for="ty in types"
        :key="ty.key"
        class="rounded-full px-3.5 py-1.5 text-sm font-medium"
        :class="ty.active
          ? 'bg-brand-600 text-white'
          : 'border border-neutral-200 text-neutral-600'"
      >
        {{ t(`landing.hero.cards.propertyType.items.${ty.key}`) }}
      </span>
    </div>
  </div>
</template>
