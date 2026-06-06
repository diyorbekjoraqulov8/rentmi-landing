<script setup lang="ts">
/**
 * Hero for /solution — big headline, supporting copy and the lead image
 * (public/solution/hero.png). Mirrors the team page hero rhythm.
 */
const { t } = useI18n()
</script>

<template>
  <section class="pt-12 md:pt-20">
    <div class="container">
      <SolutionRevealOnScroll as="h1" from="up">
        <span
          class="block text-xl font-bold leading-[1.05] tracking-tight text-neutral-900 sm:text-5xl md:text-8xl">
          {{ t('solution.hero.title') }}
        </span>
      </SolutionRevealOnScroll>

      <SolutionRevealOnScroll :delay="120" from="up">
        <p class="mt-6 max-w-sm text-base text-neutral-700 md:text-lg">
          {{ t('solution.hero.subtitle') }}
        </p>
      </SolutionRevealOnScroll>

      <SolutionRevealOnScroll :delay="200" from="up">
        <div
          class="mt-10 overflow-hidden rounded-3xl bg-neutral-100 shadow-card md:mt-14">
          <NuxtImg
            src="/solution/hero.png"
            :alt="t('solution.hero.title')"
            class="aspect-[1024/480] w-full object-cover"
            sizes="100vw md:1024px"
            preload
            fetchpriority="high" />
        </div>
      </SolutionRevealOnScroll>
    </div>
  </section>
</template>
