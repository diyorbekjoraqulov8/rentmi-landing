<script setup lang="ts">
import type { Audience } from '~/data/landing'

/**
 * Large pill toggle: "Uy egalari uchun" / "Ijarachilar uchun".
 * Active tab is solid brand with white text (matches the hero design).
 * Bound to shared useAudience() so header & hero stay in sync.
 */
const { t } = useI18n()
const { audience, setAudience } = useAudience()

const tabs: { key: Audience, labelKey: string }[] = [
  { key: 'owner', labelKey: 'landing.audience.owner' },
  { key: 'tenant', labelKey: 'landing.audience.tenant' }
]
</script>

<template>
  <div
    class="inline-flex w-full rounded-full bg-surface p-1.5 shadow-card sm:w-auto"
    role="group"
    :aria-label="t('landing.audience.label')"
  >
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      :aria-pressed="audience === tab.key"
      class="flex-1 whitespace-nowrap rounded-full px-6 py-3 text-base font-semibold transition-colors sm:px-10"
      :class="audience === tab.key
        ? 'bg-brand-600 text-white shadow-sm'
        : 'text-neutral-900 hover:text-brand-600'"
      @click="setAudience(tab.key)"
    >
      {{ t(tab.labelKey) }}
    </button>
  </div>
</template>
