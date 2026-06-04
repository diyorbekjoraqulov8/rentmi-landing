<script setup lang="ts">
/**
 * "Ilovani bepul yuklab oling" — full-bleed brand banner. Left: heading,
 * subtitle and the two store badges. Right: a phone mockup (analytics screen)
 * that bleeds off the bottom of the banner on desktop.
 */
const { t } = useI18n()

const stores = [
  { icon: 'lucide:apple', top: 'landing.download.onThe', bottom: 'landing.download.appStore', href: '#' },
  { icon: 'lucide:play', top: 'landing.download.getItOn', bottom: 'landing.download.googlePlay', href: '#' }
]
</script>

<template>
  <section class="bg-brand-600 text-white overflow-hidden">
    <div class="mx-auto max-w-[1320px] px-4 sm:px-6 grid gap-8 md:grid-cols-2 md:items-end">
      <!-- Left copy -->
      <div class="py-14 md:py-24">
        <h2 class="text-3xl md:text-5xl font-extrabold leading-tight">
          {{ t('landing.download.title') }}
        </h2>
        <p class="mt-4 max-w-md text-white/80">
          {{ t('landing.download.desc') }}
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <a
            v-for="store in stores"
            :key="store.bottom"
            :href="store.href"
            class="inline-flex items-center gap-3 rounded-xl bg-black px-5 py-2.5 hover:bg-neutral-900 transition-colors"
          >
            <Icon
              :name="store.icon"
              class="size-7"
            />
            <span class="text-left leading-tight">
              <span class="block text-[10px] text-white/70">{{ t(store.top) }}</span>
              <span class="block text-base font-semibold">{{ t(store.bottom) }}</span>
            </span>
          </a>
        </div>
      </div>

      <!-- Phone -->
      <div class="flex justify-center md:justify-end">
        <LandingPhoneMockup
          src="/landing/phone-analytics.png"
          class="md:translate-y-12"
        />
      </div>
    </div>
  </section>
</template>
