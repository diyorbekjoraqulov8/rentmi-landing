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
    <div class="relative">
      <!-- Hero landing spot for the traveling pill. Below lg it is the ONLY
           anchor (the section anchors are desktop-only), so it stays sticky
           under the header through the hero band — the audience switch must
           remain reachable on mobile. At lg+ it is plain in-flow: the pill
           departs with the hero on its spring and swims back down when the
           next section's anchor activates. -->
      <div
        class="pointer-events-none sticky top-20 z-10 flex justify-center sm:top-24 lg:static">
        <LandingAudiencePillAnchor :order="0" />
      </div>
      <!-- The one traveling audience pill — fixed; springs between the
           anchors as you scroll. Early in the DOM so it is among the first
           tab stops (it reconfigures the whole page); paint order comes from
           its fixed z-40, not DOM position. -->
      <LandingFloatingAudienceTabs />
      <LandingHeroSection />
    </div>

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
