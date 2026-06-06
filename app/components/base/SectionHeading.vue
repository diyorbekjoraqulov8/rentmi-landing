<script setup lang="ts">
/**
 * Standard section title used across landing sections.
 * `align` follows the design — most titles are left-aligned, a few centered.
 */
withDefaults(
  defineProps<{
    title: string
    eyebrow?: string
    align?: 'left' | 'center'
  }>(),
  {
    align: 'left'
  }
)
</script>

<template>
  <div :class="align === 'center' ? 'text-center' : 'text-left'">
    <p v-if="eyebrow" class="text-sm font-medium text-brand-600 mb-2">
      {{ eyebrow }}
    </p>
    <h2
      class="text-2xl md:text-5xl font-semibold tracking-tight text-neutral-900">
      {{ title }}
    </h2>
  </div>
</template>
