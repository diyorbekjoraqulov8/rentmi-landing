<script setup lang="ts">
/**
 * "Biz haqimizda, mijozlarimiz gapirishadi" — video reviews. Centered heading
 * with prev/next controls, then a horizontal snap-scroll of vertical video
 * cards (poster + headline; click to play).
 */
import { videoReviews } from '~/data/landing'

const { t } = useI18n()

const track = ref<HTMLElement | null>(null)
const scrollBy = (dir: 1 | -1) => {
  track.value?.scrollBy({
    left: dir * (track.value.clientWidth * 0.6),
    behavior: 'smooth'
  })
}
</script>

<template>
  <section
    id="video-reviews"
    class="bg-background py-16 md:py-24"
  >
    <div class="mx-auto max-w-[1320px] px-4 sm:px-6">
      <div class="relative flex items-center justify-center">
        <h2
          class="text-2xl md:text-3xl font-semibold text-neutral-900 text-center"
        >
          {{ t('landing.videoReviews.title') }}
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
        role="region"
        tabindex="0"
        :aria-label="t('landing.videoReviews.title')"
        class="mt-12 flex gap-2 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth md:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <LandingVideoReviewCard
          v-for="item in videoReviews"
          :key="item.id"
          :item="item"
          class="w-[78%] shrink-0 snap-start sm:w-[360px]"
        />
      </div>
    </div>
  </section>
</template>
