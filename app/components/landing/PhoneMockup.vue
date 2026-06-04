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
    src: 'landing/hero-phone.png',
    alt: 'Rentmi app'
  }
)
</script>

<template>
  <div class="relative mx-auto w-xs sm:w-sm">
    <!-- Titanium frame -->
    <img
      :src="src"
      :alt="alt"
      class="relative h-full w-full object-cover object-top"
      loading="lazy"
      onerror="this.style.display = 'none'" />
  </div>
</template>
