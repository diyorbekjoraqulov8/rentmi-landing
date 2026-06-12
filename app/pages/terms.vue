<script setup lang="ts">
/** "Foydalanish shartlari" — linked from the footer and the nav drawer. */
const { t } = useI18n()

useSeoMeta({
  title: () => t('legal.terms.title'),
  description: () => t('legal.terms.intro')
})
</script>

<template>
  <LegalArticle topic="terms" />
</template>
