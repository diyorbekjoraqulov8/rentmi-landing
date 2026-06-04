<script setup lang="ts">
/**
 * Right-side visual for the Features section: a highlighted tenant-score card
 * (green-tinted) over a stack of check rows (credit bureau score, court-debt,
 * tax-debt). Mirrors the Figma "Afzalliklarimiz" illustration.
 */
const { t } = useI18n()

const checks = [
  { icon: 'lucide:scale', titleKey: 'landing.features.panel.court' },
  { icon: 'lucide:landmark', titleKey: 'landing.features.panel.tax' }
]
</script>

<template>
  <div class="space-y-3">
    <!-- Highlighted score card (shares the hero ScoreCard, green-ringed) -->
    <LandingCardsScoreCard class="ring-1 ring-success-100" />

    <!-- Credit bureau row (mini gauge) -->
    <div class="flex items-center justify-between rounded-2xl bg-surface p-4 shadow-card">
      <div class="flex items-center gap-3">
        <span class="inline-flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
          <Icon
            name="lucide:gauge"
            class="size-5"
          />
        </span>
        <div>
          <p class="font-semibold text-neutral-900">
            {{ t('landing.features.panel.bureauTitle') }}
          </p>
          <p class="text-sm text-success-600">
            {{ t('landing.features.panel.trusted') }}
          </p>
        </div>
      </div>
      <img
        src="/landing/katm-scoring-indicator.svg"
        alt=""
        class="size-10 shrink-0"
      >
    </div>

    <!-- Check rows -->
    <div
      v-for="row in checks"
      :key="row.titleKey"
      class="flex items-center justify-between rounded-2xl bg-surface p-4 shadow-card"
    >
      <div class="flex items-center gap-3">
        <span class="inline-flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
          <Icon
            :name="row.icon"
            class="size-5"
          />
        </span>
        <div>
          <p class="font-semibold text-neutral-900">
            {{ t(row.titleKey) }}
          </p>
          <p class="text-sm text-neutral-500">
            {{ t('landing.features.panel.noDebt') }}
          </p>
        </div>
      </div>
      <span class="inline-flex size-8 items-center justify-center rounded-full bg-success-50 text-success-600">
        <Icon
          name="lucide:thumbs-up"
          class="size-4"
        />
      </span>
    </div>
  </div>
</template>
