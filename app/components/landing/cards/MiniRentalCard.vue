<script setup lang="ts">
/**
 * Compact rental card (the small "Dream City" card peeking bottom-left of the
 * hero). Same data shape as RentalCard but a denser, image-left layout.
 */
const { t } = useI18n()

const paid = 6
const total = 8
</script>

<template>
  <div class="overflow-hidden rounded-2xl bg-surface p-3 shadow-card w-full">
    <div class="flex gap-3">
      <!-- thumbnail -->
      <div
        class="relative w-20 h-30 shrink-0 overflow-hidden rounded-xl bg-neutral-200">
        <img
          src="/landing/mirabad-square.webp"
          alt="Dream City"
          class="h-full w-full object-cover"
          loading="lazy"
          onerror="this.style.visibility = 'hidden'" />
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-2">
          <p class="truncate text-sm font-semibold text-neutral-900">
            Dream City 3 xonali
          </p>
          <IconsDotsHorizontal class="size-4 shrink-0 text-neutral-400" />
        </div>
        <p class="flex items-center gap-1 text-[11px] text-neutral-500">
          <IconsMapPin class="size-3 shrink-0" />
          Toshkent, Shayhontohur t.
        </p>
        <div class="mt-1 flex items-center gap-2 text-[11px] text-neutral-500">
          <span class="flex items-center gap-0.5"
            ><Icon name="lucide:scan" class="size-3" />120m²</span
          >
          <span class="flex items-center gap-0.5"
            ><Icon name="lucide:layers" class="size-3" />12/16</span
          >
        </div>
        <p class="mt-1 text-sm font-bold text-neutral-900">
          23 mln so'm
          <span class="text-[10px] font-normal text-neutral-400">/ oyiga</span>
        </p>
      </div>
    </div>

    <!-- progress -->
    <div class="mt-3 flex gap-1">
      <span
        v-for="i in total"
        :key="i"
        class="h-1.5 flex-1 rounded-full"
        :class="i <= paid ? 'bg-success-500' : 'bg-neutral-200'" />
    </div>

    <!-- dates -->
    <dl class="mt-3 space-y-1 border-t border-neutral-100 pt-2 text-[11px]">
      <div class="flex justify-between">
        <dt class="text-neutral-400">
          {{ t('landing.hero.cards.rental.contractDate') }}
        </dt>
        <dd class="font-medium text-neutral-900">2-Avgust, 2025</dd>
      </div>
      <div class="flex justify-between">
        <dt class="text-neutral-400">
          {{ t('landing.hero.cards.rental.nextPayment') }}
        </dt>
        <dd class="font-medium text-neutral-900">3-Aprel, 2025</dd>
      </div>
    </dl>
  </div>
</template>
