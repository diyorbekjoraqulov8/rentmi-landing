<script setup lang="ts">
/**
 * Official "Get it on Google Play" badge. Links to the RentMi Android app.
 */
const GOOGLE_PLAY_URL =
  'https://play.google.com/store/apps/details?id=uz.iportal.uzrentme'
</script>

<template>
  <a
    :href="GOOGLE_PLAY_URL"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Get it on Google Play"
    class="inline-block transition-transform hover:scale-[1.03]">
    <img
      src="/landing/google-play.png"
      alt="Get it on Google Play"
      class="h-12 w-auto"
      loading="lazy">
  </a>
</template>
