<script setup lang="ts">
const { locale } = useI18n()

// Global SEO defaults; per-page overrides via useSeoMeta on each page.
useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  }
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
