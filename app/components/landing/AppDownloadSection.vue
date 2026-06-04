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
  <section class="bg-brand-600 text-white my-50">
    <div class="container grid gap-2 relative md:grid-cols-2 md:items-end">
      <!-- Left copy -->
      <div class="py-14 md:py-24">
        <span class="text-3xl md:text-5xl leading-tight font-medium">
          {{ t('landing.download.title') }}
        </span>
        <p class="mt-2 max-w-md text-white/80">
          {{ t('landing.download.desc') }}
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
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

      <!-- Phone -->
      <div class="absolute right-0 top-1/2 -translate-y-1/2 md:block">
        <LandingPhoneMockup src="/landing/download-app.png" />
      </div>
    </div>
  </section>
</template>
