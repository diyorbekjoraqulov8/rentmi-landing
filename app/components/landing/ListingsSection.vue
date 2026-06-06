<script setup lang="ts">
/**
 * Home "Aynan siz uchun mos uylar" — thin wrapper around the shared
 * <ListingsCarousel> (also used by the listing detail page). `id` falls through
 * to the carousel's root <section> so the in-page anchor keeps working.
 */
import { properties } from '~/data/properties'

const { t } = useI18n()
</script>

<template>
  <ListingsCarousel
    id="listings"
    :title="t('landing.listings.title')"
    :items="properties" />
</template>
