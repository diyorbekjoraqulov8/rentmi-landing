<script setup lang="ts">
/**
 * Surface card with the design-system soft elevation (shadow-card token).
 * `padded` toggles default inner padding; turn off for media-edge cards.
 */
withDefaults(
  defineProps<{
    padded?: boolean
    hover?: boolean
  }>(),
  {
    padded: true,
    hover: false
  }
)
</script>

<template>
  <div
    class="rounded-2xl bg-surface shadow-card overflow-hidden"
    :class="[
      padded ? 'p-6' : '',
      hover ? 'transition-transform duration-200 hover:-translate-y-1' : '',
    ]"
  >
    <slot />
  </div>
</template>
