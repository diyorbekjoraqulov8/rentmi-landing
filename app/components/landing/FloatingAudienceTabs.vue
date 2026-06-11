<script setup lang="ts">
import type { Audience } from '~/data/landing'

/**
 * The "Uy egalari uchun / Ijarachilar uchun" control.
 *
 * It belongs to the hero. It is NOT `position: fixed` and it never hovers over
 * the sections below. It uses `position: sticky`: while you scroll through the
 * hero it stays pinned just under the header, and when the hero ends it scrolls
 * away joined to the hero's bottom edge — the same premium pattern Apple/Stripe
 * use for an in-hero control that "docks" to the top, then leaves with its
 * section instead of floating over the next one.
 *
 * The sticky range is bounded by the wrapper in `pages/index.vue` (pill + hero
 * only), so the pill is confined to the hero band. The wrapper must NOT clip
 * overflow — `overflow: hidden` on an ancestor disables `position: sticky`.
 */
const { t } = useI18n()
const { audience, setAudience, isOwner } = useAudience()

const tabs: { key: Audience, labelKey: string }[] = [
  { key: 'owner', labelKey: 'landing.audience.owner' },
  { key: 'tenant', labelKey: 'landing.audience.tenant' }
]
</script>

<template>
  <div class="pointer-events-none sticky top-20 z-40 flex justify-center sm:top-24">
    <div
      class="pointer-events-auto inline-flex rounded-full border border-neutral-200/70 bg-surface/80 p-1.5 shadow-[0_10px_34px_-14px_rgba(16,24,40,0.4)] backdrop-blur-xl"
      role="group"
      :aria-label="t('landing.audience.label')"
    >
      <div class="relative grid grid-cols-2">
        <!-- Sliding active indicator -->
        <span
          aria-hidden="true"
          class="absolute inset-y-0 left-0 w-1/2 rounded-full bg-brand-600 shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          :class="isOwner ? 'translate-x-0' : 'translate-x-full'"
        />
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          :aria-pressed="audience === tab.key"
          class="relative z-10 whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-semibold transition-colors duration-300 sm:px-9 sm:py-3 sm:text-base"
          :class="audience === tab.key
            ? 'text-white'
            : 'text-neutral-900 hover:text-brand-600'"
          @click="setAudience(tab.key)"
        >
          {{ t(tab.labelKey) }}
        </button>
      </div>
    </div>
  </div>
</template>
