<script setup lang="ts">
/**
 * "Ilovani bepul yuklab oling" — full-bleed brand banner. Left: heading,
 * subtitle and the two store badges. Right: a phone mockup (analytics screen)
 * that bleeds off the bottom of the banner on desktop.
 */
const { t } = useI18n()

const stores = [
  {
    icon: 'lucide:apple',
    top: 'landing.download.onThe',
    bottom: 'landing.download.appStore',
    href: '#'
  },
  {
    icon: 'lucide:play',
    top: 'landing.download.getItOn',
    bottom: 'landing.download.googlePlay',
    href: '#'
  }
]
</script>

<template>
  <section class="bg-brand-600 text-white my-16 md:my-32">
    <div
      class="container relative grid gap-8 overflow-hidden md:grid-cols-2 md:items-end md:gap-2 md:overflow-visible">
      <!-- Left copy -->
      <div class="pt-12 text-center md:py-24 md:text-left">
        <h2 class="text-3xl md:text-5xl leading-tight font-medium">
          {{ t('landing.download.title') }}
        </h2>
        <p class="mx-auto mt-3 max-w-md text-white/80 md:mx-0">
          {{ t('landing.download.desc') }}
        </p>

        <div class="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
          <a
            v-for="store in stores"
            :key="store.bottom"
            :href="store.href"
            class="inline-flex items-center gap-3 rounded-xl bg-black px-5 py-2.5 hover:bg-neutral-900 transition-colors">
            <Icon :name="store.icon" class="size-7" />
            <span class="text-left leading-tight">
              <span class="block text-[10px] text-white/70">{{
                t(store.top)
              }}</span>
              <span class="block text-base font-semibold">{{
                t(store.bottom)
              }}</span>
            </span>
          </a>
        </div>
      </div>

      <!-- Phone: in-flow & centered on mobile, bleeds off the bottom on desktop -->
      <div
        class="flex justify-center md:absolute md:right-0 md:top-1/2 md:block md:-translate-y-1/2">
        <LandingPhoneMockup src="/landing/download-app.png" />
      </div>
    </div>
  </section>
</template>
