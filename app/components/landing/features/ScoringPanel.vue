<script setup lang="ts">
/**
 * Tenant "scoring" feature illustration: a stack of tenant-score cards (each a
 * half-gauge + verdict) with the "Baholash mezonlari" (evaluation criteria)
 * panel overlapping the top-right. Display-only mock.
 */
const { t } = useI18n()

// pct drives the gauge fill (pathLength=100) and the colour.
const scores = [
  { label: '96%', pct: 96, good: true, sampleKey: 'high', cta: false },
  { label: '86/100', pct: 86, good: true, sampleKey: 'mid', cta: true },
  { label: '24/100', pct: 24, good: false, sampleKey: 'low', cta: true }
] as const

const criteria = [
  { key: 'income', done: true },
  { key: 'credit', done: false },
  { key: 'obligations', done: false },
  { key: 'rental', done: false }
] as const
</script>

<template>
  <div class="relative">
    <!-- Score cards -->
    <div class="w-full max-w-[270px] space-y-3">
      <div
        v-for="s in scores"
        :key="s.label"
        class="rounded-2xl bg-surface p-4 shadow-card"
      >
        <div class="flex items-center gap-3">
          <!-- Half gauge -->
          <div class="relative w-14 shrink-0">
            <svg
              viewBox="0 0 100 56"
              class="w-full"
            >
              <path
                d="M8,50 A42,42 0 0 1 92,50"
                fill="none"
                stroke="var(--color-neutral-200)"
                stroke-width="10"
                stroke-linecap="round"
                pathLength="100"
              />
              <path
                d="M8,50 A42,42 0 0 1 92,50"
                fill="none"
                :stroke="s.good ? 'var(--color-success-500)' : '#ef4444'"
                stroke-width="10"
                stroke-linecap="round"
                pathLength="100"
                :stroke-dasharray="100"
                :stroke-dashoffset="100 - s.pct"
              />
            </svg>
            <span class="absolute inset-x-0 bottom-0 text-center text-[11px] font-bold text-neutral-900">{{ s.label }}</span>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-bold text-neutral-900">
              {{ t('landing.features.tpanels.scoring.cardTitle') }}
            </p>
            <p class="mt-0.5 text-[11px] leading-snug text-neutral-500">
              {{ t(`landing.features.tpanels.scoring.samples.${s.sampleKey}`) }}
            </p>
          </div>
        </div>
        <div
          v-if="s.cta"
          class="mt-3 w-full rounded-xl bg-neutral-100 py-2 text-center text-xs font-semibold text-neutral-700"
        >
          {{ t('landing.features.tpanels.scoring.improve') }}
        </div>
      </div>
    </div>

    <!-- Criteria panel (overlaps top-right) -->
    <div
      class="mt-4 w-full max-w-[280px] rounded-2xl bg-surface p-5 shadow-card ring-1 ring-black/5 sm:absolute sm:right-0 sm:top-12 sm:mt-0"
    >
      <p class="font-bold text-neutral-900">
        {{ t('landing.features.tpanels.scoring.criteriaTitle') }}
      </p>
      <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-100">
        <div class="h-full w-1/4 rounded-full bg-brand-600" />
      </div>

      <ul class="mt-4 space-y-3">
        <li
          v-for="c in criteria"
          :key="c.key"
          class="flex items-center gap-2.5 text-sm"
        >
          <span
            v-if="c.done"
            class="inline-flex size-5 items-center justify-center rounded-full bg-brand-600 text-white"
          >
            <Icon
              name="lucide:check"
              class="size-3"
            />
          </span>
          <span
            v-else
            class="size-5 rounded-full border-2 border-neutral-200"
          />
          <span :class="c.done ? 'font-medium text-neutral-900' : 'text-neutral-500'">
            {{ t(`landing.features.tpanels.scoring.criteria.${c.key}`) }}
          </span>
        </li>
      </ul>

      <p class="mt-4 border-t border-neutral-100 pt-3 text-[11px] leading-snug text-neutral-400">
        {{ t('landing.features.tpanels.scoring.secure') }}
      </p>
    </div>
  </div>
</template>
