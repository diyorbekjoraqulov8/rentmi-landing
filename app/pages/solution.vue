<script setup lang="ts">
/**
 * "/solution" — "Uy topish va ijaraga berish endi muammo emas". The product
 * story page: hero, our story, problem↔solution, mission/vision/values,
 * a scroll-pinned "how it works" walkthrough and "why Rentmi". A fixed
 * scroll-spy side-nav tracks the reader's position.
 *
 * Built to mirror the team page conventions (SEO via useSeoMeta, structured
 * data via useSchemaOrg, content in i18n + ~/data).
 */
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { siteUrl } = useRuntimeConfig().public

const canonical = computed(() => `${siteUrl}${localePath('/solution')}`)

useSeoMeta({
  title: () => t('solution.seo.title'),
  description: () => t('solution.seo.description'),
  ogTitle: () => t('solution.seo.og.title'),
  ogDescription: () => t('solution.seo.og.description'),
  ogType: 'website',
  ogImage: '/solution/hero.png',
  ogLocale: () => locale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('solution.seo.og.title'),
  twitterDescription: () => t('solution.seo.og.description'),
  twitterImage: '/solution/hero.png'
})

useHead({
  link: [{ rel: 'canonical', href: canonical }],
  // No-JS / crawler fallback: reveal-on-scroll blocks start hidden and are
  // shown by JS — without it, force them visible so content is never blank.
  noscript: [
    {
      innerHTML:
        '.reveal{opacity:1 !important;transform:none !important}'
    }
  ]
})

// Structured data — the organisation plus a self-describing service breakdown
// (helps the page surface for "uy ijara" style queries).
useSchemaOrg([
  defineOrganization({ name: 'rentmi.uz', logo: '/landing/rentme-logo.png' }),
  defineWebPage({
    name: () => t('solution.seo.title'),
    description: () => t('solution.seo.description')
  })
])
</script>

<template>
  <div class="pb-24">
    <SolutionSideNav />

    <SolutionHero />
    <SolutionStory />
    <SolutionProblemSolution />
    <SolutionMission />
    <SolutionHowItWorks />
    <SolutionWhyRentmi />
  </div>
</template>
