<script setup lang="ts">
/**
 * Tenant "best homes" feature illustration: the app phone with two TOP
 * listing cards floating off its right edge — the curated, verified homes a
 * renter browses. Display-only mock data.
 */
const { t } = useI18n()

const cards = [
  {
    title: 'Drujba NRG | U Tower',
    addr: 'Toshkent, Yashnobod t. Tolariq k. 40',
    price: "18 mln so'm",
    area: '120m²',
    floor: '12/16',
    top: '14'
  },
  {
    title: 'Mirabad Square | Penthouse',
    addr: 'Toshkent, Mirobod t. Mirobod Avenue, D, 34',
    price: "24,5 mln so'm",
    area: '185m²',
    floor: '12/12',
    top: '34'
  }
]
</script>

<template>
  <div class="relative">
    <!-- Phone -->
    <div class="w-[230px] sm:w-[260px]">
      <LandingPhoneMockup src="/landing/hero-phone-2.png" />
    </div>

    <!-- Floating listing cards (off the right edge), stacked -->
    <div class="absolute right-0 top-8 hidden w-[210px] space-y-4 sm:block">
      <div
        v-for="(c, i) in cards"
        :key="c.title"
        class="overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-black/5"
        :class="i === 1 ? 'translate-x-6' : ''">
        <div class="relative aspect-[16/11] bg-neutral-200">
          <img
            src="/landing/drujba.png"
            :alt="c.title"
            class="h-full w-full object-cover"
            onerror="this.style.visibility = 'hidden'" />
          <span
            class="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-brand-600 px-1.5 py-0.5 text-[9px] font-semibold text-white">
            <IconsCrown class="size-2.5" />Top
          </span>
          <span
            class="absolute right-2 top-2 inline-flex size-6 items-center justify-center rounded-full bg-white/90 text-neutral-600">
            <IconsHeart class="size-3" />
          </span>
          <span
            class="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-md bg-black/55 px-1.5 py-0.5 text-[9px] text-white backdrop-blur">
            <span class="flex items-center gap-0.5"
              ><Icon name="lucide:scan" class="size-2.5" />{{ c.area }}</span
            >
            <span class="flex items-center gap-0.5"
              ><Icon name="lucide:layers" class="size-2.5" />{{ c.floor }}</span
            >
          </span>
        </div>
        <div class="p-2.5">
          <p class="truncate text-xs font-semibold text-neutral-900">
            {{ c.title }}
          </p>
          <p class="mt-0.5 flex items-center gap-1 text-[9px] text-neutral-500">
            <IconsMapPin class="size-2.5 shrink-0" /><span class="truncate">{{
              c.addr
            }}</span>
          </p>
          <p class="mt-1 text-xs font-bold text-neutral-900">
            {{ c.price }}
            <span class="text-[8px] font-normal text-neutral-400"
              >/ {{ t('landing.listings.perMonth') }}</span
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
