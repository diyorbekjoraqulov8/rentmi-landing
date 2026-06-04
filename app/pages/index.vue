<script setup lang="ts">
/**
 * Landing page — pure composition. Each section is a self-contained component
 * under components/landing/; this file only orders them and sets page SEO.
 */
const { t } = useI18n()

useSeoMeta({
  title: () => t('seo.title'),
  description: () => t('seo.description'),
  ogTitle: () => t('seo.og.title'),
  ogDescription: () => t('seo.og.description'),
  ogType: 'website',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div>
    <LandingHeroSection />
    <LandingAboutSection />
    <LandingFeaturesSection />
    <LandingListingsSection />
    <LandingAppDownloadSection />
    <LandingTestimonialsSection />
    <LandingFaqSection />
    <LandingBlogSection />
  </div>
</template>
