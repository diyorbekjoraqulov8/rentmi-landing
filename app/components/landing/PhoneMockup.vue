<script setup lang="ts">
/**
 * Realistic iPhone frame (Dynamic Island). The inner screen is an image —
 * drop the exported app screen at `public/landing/phone-screen.webp` (or pass a
 * different `src`). Until the file exists a soft brand-gradient placeholder is
 * shown so layout/spacing is already correct.
 */
const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    /** Hero phone is the LCP element → load eagerly with high priority. */
    priority?: boolean
    /** `hero` is the enlarged centerpiece; `default` is the inline size. */
    size?: 'default' | 'hero'
  }>(),
  {
    src: 'landing/hero-phone.webp',
    alt: 'Rentmi app',
    priority: false,
    size: 'default'
  }
)

const widthClass = computed(() =>
  props.size === 'hero'
    ? 'w-[17rem] sm:w-[18rem] md:w-[19rem] lg:w-[20rem]'
    : 'w-3xs sm:w-2xs'
)
</script>

<template>
  <div
    class="relative mx-auto"
    :class="widthClass"
  >
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
