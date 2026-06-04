<script setup lang="ts">
/**
 * Realistic iPhone frame (Dynamic Island). The inner screen is an image —
 * drop the exported app screen at `public/landing/phone-screen.png` (or pass a
 * different `src`). Until the file exists a soft brand-gradient placeholder is
 * shown so layout/spacing is already correct.
 */
withDefaults(
  defineProps<{
    src?: string
    alt?: string
  }>(),
  {
    src: '/landing/phone-screen.png',
    alt: 'Rentmi app'
  }
)
</script>

<template>
  <div class="relative mx-auto w-[270px] sm:w-[300px]">
    <!-- Titanium frame -->
    <div class="rounded-[3rem] bg-neutral-900 p-[10px] shadow-[0_30px_60px_-15px_rgba(16,24,40,0.35)]">
      <div class="relative overflow-hidden rounded-[2.4rem] bg-neutral-100 aspect-[9/19.5]">
        <!-- Brand-gradient placeholder (shows through until the image is added) -->
        <div class="absolute inset-0 bg-gradient-to-b from-brand-700 to-brand-500" />

        <!-- App screen image (sits above the placeholder). Plain <img> so a
             not-yet-added file simply falls back to the gradient instead of a
             build-time resolve error. Switch to <NuxtImg> once the asset exists. -->
        <img
          :src="src"
          :alt="alt"
          class="relative h-full w-full object-cover object-top"
          loading="lazy"
          onerror="this.style.display='none'"
        >

        <!-- Dynamic Island -->
        <div class="absolute left-1/2 top-3 z-10 h-7 w-24 -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  </div>
</template>
