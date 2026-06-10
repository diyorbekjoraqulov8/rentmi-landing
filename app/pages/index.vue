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

// Structured data for rich results (Organization + WebSite/SearchAction).
useSchemaOrg([
  defineOrganization({
    name: 'rentmi.uz',
    logo: '/landing/rentme-logo.webp',
    sameAs: ['https://t.me/rentmi_uz', 'https://instagram.com/rentmi.uz']
  }),
  defineWebSite({ name: 'rentmi.uz' })
])
</script>

<template>
  <div>
    <!-- One audience pill for the whole page: floating, fixed top-centre. -->
    <LandingFloatingAudienceTabs />

    <LandingHeroSection />
    <LandingAboutSection />
    <LandingFeaturesSection />
    <LandingListingsSection />
    <LandingAppDownloadSection />
    <LandingTestimonialsSection />
    <LandingFaqSection />
    <LandingVideoReviewsSection />
    <!-- <LandingBlogSection /> -->
  </div>
</template>
