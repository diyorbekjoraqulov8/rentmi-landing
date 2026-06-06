<script setup lang="ts">
/**
 * "Ilovani bepul yuklab oling" — full-bleed brand banner. Left: heading,
 * subtitle and the two store badges. Right: a phone mockup (analytics screen)
 * that bleeds off the bottom of the banner on desktop.
 */
const { t } = useI18n()
</script>

<template>
  <section class="bg-brand-600 text-white my-16 md:my-32">
    <div
      class="container relative grid items-center gap-8 overflow-hidden md:grid-cols-2 md:overflow-visible">
      <!-- Left copy -->
      <div class="pt-12 text-center md:py-24 md:text-left">
        <h2 class="text-3xl md:text-5xl leading-tight font-medium">
          {{ t('landing.download.title') }}
        </h2>
        <p class="mx-auto mt-3 max-w-md text-white/80 md:mx-0">
          {{ t('landing.download.desc') }}
        </p>

        <div class="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
          <SharedAppStoreBadge />
          <SharedGooglePlayBadge />
        </div>
      </div>

      <!-- Phone: in-flow & centered on mobile; on desktop it sits centered in
           the right half and bleeds above & below the blue band. -->
      <div
        class="flex justify-center md:absolute md:inset-y-0 md:left-1/2 md:right-0 md:items-center">
        <img
          src="/landing/download-app.png"
          alt="Rentmi app"
          class="w-60 max-w-full sm:w-72 md:w-85"
          loading="lazy"
          decoding="async">
      </div>
    </div>
  </section>
</template>
