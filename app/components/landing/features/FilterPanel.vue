<script setup lang="ts">
/**
 * Tenant "filter" feature illustration: the in-app rent-price range filter
 * stacked over the property-type picker — the same display-only cards the
 * tenant hero floats. Shows how a renter narrows the search.
 */
</script>

<template>
  <div class="space-y-4">
    <div class="max-w-[360px]">
      <LandingCardsPriceFilterCard />
    </div>
    <div class="max-w-[360px]">
      <LandingCardsPropertyTypeCard />
    </div>
  </div>
</template>
