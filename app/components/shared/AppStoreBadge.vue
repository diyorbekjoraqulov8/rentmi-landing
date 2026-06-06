<script setup lang="ts">
/**
 * Official "Download on the App Store" badge. Links to the RentMi iOS app.
 */
const APP_STORE_URL = 'https://apps.apple.com/us/app/rentmi/id6761826946'
</script>

<template>
  <a
    :href="APP_STORE_URL"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Download on the App Store"
    class="inline-block transition-transform hover:scale-[1.03]">
    <img
      src="/landing/apple-store.png"
      alt="Download on the App Store"
      class="h-12 w-auto"
      loading="lazy">
  </a>
</template>
