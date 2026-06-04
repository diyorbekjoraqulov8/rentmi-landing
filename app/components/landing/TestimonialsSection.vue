<script setup lang="ts">
/**
 * "Biz haqimizda, mijozlarimiz gapirishadi" — centered heading with prev/next
 * controls on the right, then a horizontal snap-scroll of testimonial cards.
 */
import { testimonials } from '~/data/landing'

const { t } = useI18n()

const track = ref<HTMLElement | null>(null)
const scrollBy = (dir: 1 | -1) => {
  track.value?.scrollBy({ left: dir * (track.value.clientWidth * 0.6), behavior: 'smooth' })
}
</script>

<template>
  <section
    id="testimonials"
    class="bg-background py-16 md:py-24"
  >
    <div class="mx-auto max-w-[1320px] px-4 sm:px-6">
      <div class="relative flex items-center justify-center">
        <h2 class="text-2xl md:text-3xl font-bold text-neutral-900 text-center">
          {{ t('landing.testimonials.title') }}
        </h2>
        <div class="absolute right-0 hidden sm:flex gap-2">
          <button
            type="button"
            class="inline-flex size-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
            :aria-label="t('landing.listings.prev')"
            @click="scrollBy(-1)"
          >
            <IconsChevronLeft class="size-5" />
          </button>
          <button
            type="button"
            class="inline-flex size-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
            :aria-label="t('landing.listings.next')"
            @click="scrollBy(1)"
          >
            <IconsChevronRight class="size-5" />
          </button>
        </div>
      </div>

      <div
        ref="track"
        class="mt-10 flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <LandingTestimonialCard
          v-for="item in testimonials"
          :key="item.id"
          :item="item"
          class="w-[88%] shrink-0 snap-start sm:w-[440px]"
        />
      </div>
    </div>
  </section>
</template>
