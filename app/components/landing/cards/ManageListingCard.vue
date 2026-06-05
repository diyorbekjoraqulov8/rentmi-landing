<script setup lang="ts">
import type { ManageListing } from '~/data/landing'

/**
 * Property card for the "Aynan siz uchun mos uylar" carousel.
 *
 * Two states sharing one cover photo:
 *  - default — a white card: framed cover up top, details below.
 *  - active  — a dark full-bleed cover with the details overlaid in white.
 *
 * Hovering crossfades default → active. The `recommended` lead card is pinned
 * to the active state (and carries the "Rentmi tavsiya qiladi" badge).
 */
defineProps<{ item: ManageListing }>()

const { t } = useI18n()
</script>

<template>
  <article
    class="group relative h-[372px] overflow-hidden rounded-[22px] bg-surface shadow-card transition-shadow duration-300 hover:shadow-xl"
  >
    <!-- full-bleed cover (the active-state background) -->
    <img
      :src="item.src"
      :alt="item.title"
      loading="lazy"
      decoding="async"
      class="absolute inset-0 h-full w-full object-cover"
      onerror="this.style.visibility = 'hidden'"
    >
    <!-- darkening gradient: on hover, or always for the lead card -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5 transition-opacity duration-300"
      :class="
        item.recommended ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      "
    />

    <!-- DEFAULT white panel — fades out on hover (absent for the lead card) -->
    <div
      class="absolute inset-0 flex flex-col bg-surface p-2.5 transition-opacity duration-300"
      :class="
        item.recommended ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
      "
    >
      <div class="relative h-[200px] shrink-0 overflow-hidden rounded-2xl bg-neutral-200">
        <img
          :src="item.src"
          :alt="item.title"
          loading="lazy"
          decoding="async"
          class="h-full w-full object-cover"
          onerror="this.style.visibility = 'hidden'"
        >
        <span
          class="absolute bottom-2.5 right-2.5 inline-flex items-center gap-2 rounded-lg bg-black/55 px-2 py-1 text-[11px] font-medium text-white backdrop-blur"
        >
          <span class="flex items-center gap-1"><IconsGrid class="text-[13px]" />{{ item.area }}</span>
          <span class="h-3 w-px bg-white/30" />
          <span class="flex items-center gap-1"><IconsChartBars class="text-[13px]" />{{ item.floor }}</span>
        </span>
      </div>

      <div class="flex flex-1 flex-col px-1.5 pt-3">
        <p class="font-semibold text-neutral-900 line-clamp-1">
          {{ item.title }}
        </p>
        <p class="mt-1 flex items-center gap-1 text-xs text-neutral-500 line-clamp-1">
          <IconsMapPin class="shrink-0 text-sm" />{{ t(item.addressKey) }}
        </p>
        <div class="mt-auto flex items-center justify-between pt-3">
          <p class="font-bold text-neutral-900">
            {{ item.price }}
            <span class="text-xs font-normal text-neutral-400">/ {{ t('landing.listings.perMonth') }}</span>
          </p>
          <span class="flex items-center gap-1 text-xs text-neutral-400">{{ item.views }}<IconsEye class="text-sm" /></span>
        </div>
      </div>
    </div>

    <!-- ACTIVE dark overlay — fades in on hover (always on for the lead card) -->
    <div
      class="absolute inset-x-0 bottom-0 flex flex-col p-5 text-white transition-opacity duration-300"
      :class="
        item.recommended ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      "
    >
      <div class="mb-2 flex items-center gap-3 text-xs text-white/90">
        <span class="flex items-center gap-1"><IconsGrid class="text-[13px]" />{{ item.area }}</span>
        <span class="flex items-center gap-1"><IconsChartBars class="text-[13px]" />{{ item.floor }}</span>
      </div>
      <p class="font-semibold line-clamp-1">
        {{ item.title }}
      </p>
      <p class="mt-1 flex items-center gap-1 text-xs text-white/70 line-clamp-1">
        <IconsMapPin class="shrink-0 text-sm" />{{ t(item.addressKey) }}
      </p>
      <div class="mt-3 flex items-center justify-between">
        <p class="font-bold">
          {{ item.price }}
          <span class="text-xs font-normal text-white/60">/ {{ t('landing.listings.perMonth') }}</span>
        </p>
        <span class="flex items-center gap-1 text-xs text-white/70">{{ item.views }}<IconsEye class="text-sm" /></span>
      </div>
    </div>

    <!-- shared chrome: badge + favourite, above both layers -->
    <span
      class="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur"
      :class="
        item.recommended ? 'bg-black/40 text-white' : 'bg-white/95 text-neutral-800'
      "
    >
      <IconsCrown
        class="text-sm"
        :class="item.recommended ? 'text-amber-300' : 'text-amber-500'"
      />
      {{
        item.recommended
          ? t('landing.listings.badge.recommended')
          : t('landing.listings.badge.top')
      }}
    </span>
    <button
      type="button"
      class="absolute right-4 top-4 z-10 inline-flex size-8 items-center justify-center rounded-full bg-white/95 text-neutral-600 shadow-sm transition hover:text-brand-600"
      :aria-label="t('landing.listings.favorite')"
    >
      <IconsHeart class="text-sm" />
    </button>
  </article>
</template>
