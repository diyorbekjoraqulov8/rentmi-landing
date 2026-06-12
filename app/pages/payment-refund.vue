<script setup lang="ts">
/** "To'lov va qaytarish" — linked from the footer. */
const { t } = useI18n()

useSeoMeta({
  title: () => t('legal.payment.title'),
  description: () => t('legal.payment.intro')
})
</script>

<template>
  <LegalArticle topic="payment" />
</template>
