<script setup lang="ts">
/**
 * Home "Aynan siz uchun mos uylar" — thin wrapper around the shared
 * <ListingsCarousel> (also used by the listing detail page). `id` falls through
 * to the carousel's root <section> so the in-page anchor keeps working.
 */
import { properties } from '~/data/properties'

const { t } = useI18n()
const { announcements } = useAnnouncements()

// Live announcements (loaded in the background after hydration) replace the
// static mock listings as soon as they arrive.
const items = computed(() => announcements.value ?? properties)
</script>

<template>
  <ListingsCarousel
    id="listings"
    :title="t('landing.listings.title')"
    :items="items">
    <template #below>
      <!-- Traveling-pill landing spot: centered below the cards. Desktop only
           — on mobile the pill stays with the hero. -->
      <div class="mt-10 hidden justify-center md:mt-12 lg:flex">
        <LandingAudiencePillAnchor :order="2" />
      </div>
    </template>
  </ListingsCarousel>
</template>
