<script setup lang="ts">
/**
 * Rentmi brand lockup (real pin mark + wordmark), matching the Figma header.
 * Clicking always lands on the landing hero: smooth-scrolls to the top when
 * already home, otherwise navigates home first.
 */
withDefaults(defineProps<{ size?: 'sm' | 'md' }>(), { size: 'md' })

const { homePath, goHome } = useSectionNav()

function onClick(e: MouseEvent) {
  // Let modified clicks (new tab, etc.) and non-primary buttons behave natively.
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
  e.preventDefault()
  goHome()
}
</script>

<template>
  <NuxtLink
    :to="homePath"
    aria-label="Rentmi"
    class="flex items-center gap-2 font-bold text-brand-600 transition-opacity hover:opacity-80"
    :class="size === 'sm' ? 'text-xl' : 'text-2xl'"
    @click="onClick"
  >
    <IconsLogo :class="size === 'sm' ? 'size-6' : 'size-7'" />
    Rentmi
  </NuxtLink>
</template>
