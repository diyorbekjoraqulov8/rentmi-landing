<script setup lang="ts">
/**
 * Horizontal property carousel — shared by the home "Aynan siz uchun mos uylar"
 * section and the listing detail "O'xshash e'lonlar" row. Native overflow-scroll
 * with snap; cards are a fixed width and don't stretch. Arrows page by ~80%.
 */
import type { Property } from '~/data/properties'

defineProps<{
  title: string
  items: Property[]
}>()

const { t } = useI18n()

const track = ref<HTMLElement | null>(null)
const scrollBy = (dir: 1 | -1) => {
  track.value?.scrollBy({
    left: dir * (track.value.clientWidth * 0.8),
    behavior: 'smooth'
  })
}
</script>

<template>
  <section class="bg-background py-16 md:py-24">
    <div class="px-10 sm:px-16">
      <div class="container flex items-center justify-between gap-4">
        <h2 class="text-2xl font-bold text-neutral-900 md:text-3xl">
          {{ title }}
        </h2>
        <div class="hidden gap-2 sm:flex">
          <button
            type="button"
            class="inline-flex size-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
            :aria-label="t('landing.listings.prev')"
            @click="scrollBy(-1)">
            <IconsChevronLeft class="size-5" />
          </button>
          <button
            type="button"
            class="inline-flex size-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
            :aria-label="t('landing.listings.next')"
            @click="scrollBy(1)">
            <IconsChevronRight class="size-5" />
          </button>
        </div>
      </div>

      <div
        ref="track"
        role="region"
        tabindex="0"
        :aria-label="title"
        class="mt-8 flex gap-5 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <LandingCardsManageListingCard
          v-for="item in items"
          :key="item.id"
          :item="item"
          class="w-68 shrink-0 snap-start" />
      </div>

      <!-- e.g. the home page drops the traveling pill's anchor here, centered
           under the cards -->
      <slot name="below" />
    </div>
  </section>
</template>
