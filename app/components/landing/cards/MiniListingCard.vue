<script setup lang="ts">
/**
 * Floating image-first listing card (the "Drujba NRG | U Tower" card peeking
 * on the tenant hero). Cover image fills the card; a dark gradient at the
 * bottom carries the title / price / views — mirrors the in-app TOP listing
 * card. Content is hardcoded sample data like the other floating cards.
 */
const { t } = useI18n()
</script>

<template>
  <div class="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-800 shadow-card">
    <img
      src="/landing/listing-penthouse.png"
      alt="Drujba NRG | U Tower"
      class="absolute inset-0 h-full w-full object-cover"
      onerror="this.style.visibility='hidden'"
    >
    <!-- readability gradient -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" />

    <!-- meta pills (top-left) -->
    <div class="absolute left-3 top-3 flex items-center gap-1.5 text-[11px] text-white">
      <span class="inline-flex items-center gap-1 rounded-md bg-black/45 px-2 py-1 backdrop-blur">
        <Icon
          name="lucide:scan"
          class="size-3"
        />120m²
      </span>
      <span class="inline-flex items-center gap-1 rounded-md bg-black/45 px-2 py-1 backdrop-blur">
        <Icon
          name="lucide:layers"
          class="size-3"
        />12/16
      </span>
    </div>

    <!-- favourite (top-right) -->
    <span
      class="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full bg-white/90 text-neutral-700"
    >
      <IconsHeart class="size-4" />
    </span>

    <!-- body (bottom) -->
    <div class="absolute inset-x-0 bottom-0 p-4 text-white">
      <p class="font-semibold leading-tight">
        Drujba NRG | U Tower
      </p>
      <p class="mt-1 flex items-center gap-1 text-[11px] text-white/70">
        <IconsMapPin class="size-3 shrink-0" />
        Toshkent, Yashnobod t. Tolariq k. 40
      </p>
      <div class="mt-2 flex items-end justify-between">
        <p class="text-sm font-bold">
          18 000 000 UZS <span class="text-[10px] font-normal text-white/60">/ {{ t('landing.listings.perMonth') }}</span>
        </p>
        <span class="flex items-center gap-1 text-[11px] text-white/80">
          <IconsEye class="size-3.5" />125
        </span>
      </div>
    </div>
  </div>
</template>
