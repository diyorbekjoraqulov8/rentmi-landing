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
    /** Hero phone is the LCP element → load eagerly with high priority. */
    priority?: boolean
  }>(),
  {
    src: 'landing/hero-phone.png',
    alt: 'Rentmi app',
    priority: false
  }
)
</script>

<template>
  <div class="relative mx-auto w-3xs sm:w-2xs">
    <!-- Titanium frame -->
    <img
      :src="src"
      :alt="alt"
      width="384"
      height="788"
      class="relative h-full w-full object-cover object-top"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : 'auto'"
      decoding="async"
      onerror="this.style.display = 'none'"
    >
  </div>
</template>
