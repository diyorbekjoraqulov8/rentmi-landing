<script setup lang="ts">
/** "Maxfiylik siyosati" — linked from the footer and the nav drawer. */
const { t } = useI18n()

useSeoMeta({
  title: () => t('legal.privacy.title'),
  description: () => t('legal.privacy.intro')
})
</script>

<template>
  <LegalArticle topic="privacy" />
</template>
