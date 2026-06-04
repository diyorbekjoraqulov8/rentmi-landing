<script setup lang="ts">
/**
 * Floating "Ijara narxi" (rent price) filter card on the tenant hero.
 * Display-only mock of the in-app dual-range price filter: currency toggle,
 * min/max fields and a two-handle slider with a tick scale.
 */
const { t } = useI18n()

// Tick scale under the slider (purely decorative).
const ticks = 40
// Filled portion of the track (matches the design's ~15%–55% selection).
const fillStart = 15
const fillEnd = 55
</script>

<template>
  <div class="rounded-2xl bg-surface p-4 shadow-card w-full">
    <!-- Header: title + currency toggle -->
    <div class="flex items-center justify-between">
      <p class="font-semibold text-neutral-900">
        {{ t('landing.hero.cards.priceFilter.title') }}
      </p>
      <div class="inline-flex rounded-lg bg-neutral-100 p-0.5 text-xs">
        <span class="rounded-md bg-surface px-2.5 py-1 font-medium text-neutral-900 shadow-sm">
          {{ t('landing.hero.cards.priceFilter.currencyUzs') }}
        </span>
        <span class="px-2.5 py-1 text-neutral-400">
          {{ t('landing.hero.cards.priceFilter.currencyUsd') }}
        </span>
      </div>
    </div>

    <!-- Min / Max fields -->
    <div class="mt-4 grid grid-cols-2 gap-3">
      <div>
        <p class="text-xs text-neutral-400">
          {{ t('landing.hero.cards.priceFilter.min') }}
        </p>
        <div class="mt-1 flex items-center justify-between rounded-lg border border-neutral-200 px-2.5 py-2 text-sm">
          <span class="font-medium text-neutral-900">5 000 000</span>
          <span class="text-neutral-400">{{ t('landing.hero.cards.priceFilter.currencyUzs') }}</span>
        </div>
      </div>
      <div>
        <p class="text-xs text-neutral-400">
          {{ t('landing.hero.cards.priceFilter.max') }}
        </p>
        <div class="mt-1 flex items-center justify-between rounded-lg border border-neutral-200 px-2.5 py-2 text-sm">
          <span class="font-medium text-neutral-900">15 000 000</span>
          <span class="text-neutral-400">{{ t('landing.hero.cards.priceFilter.currencyUzs') }}</span>
        </div>
      </div>
    </div>

    <!-- Dual-range slider (decorative) -->
    <div class="mt-5">
      <div class="relative h-1.5 rounded-full bg-neutral-200">
        <div
          class="absolute inset-y-0 rounded-full bg-brand-600"
          :style="{ left: `${fillStart}%`, right: `${100 - fillEnd}%` }"
        />
        <span
          class="absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-2 border-brand-600 bg-white shadow"
          :style="{ left: `${fillStart}%`, marginLeft: '-8px' }"
        />
        <span
          class="absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-2 border-brand-600 bg-white shadow"
          :style="{ left: `${fillEnd}%`, marginLeft: '-8px' }"
        />
      </div>
      <!-- tick scale -->
      <div class="mt-2 flex items-end gap-[2px]">
        <span
          v-for="i in ticks"
          :key="i"
          class="w-px flex-1 rounded-full"
          :class="[
            i >= fillStart / 100 * ticks && i <= fillEnd / 100 * ticks ? 'bg-brand-400' : 'bg-neutral-200',
            i % 5 === 0 ? 'h-2.5' : 'h-1.5',
          ]"
        />
      </div>
      <div class="mt-2 flex justify-between text-[10px] text-neutral-400">
        <span>5 000 000</span>
        <span>30 000 000</span>
      </div>
    </div>
  </div>
</template>
