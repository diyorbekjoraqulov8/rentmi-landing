<script setup lang="ts">
/**
 * Hero — matches the Figma layout.
 *
 *  Desktop: audience tabs centered on top; the app phone sits in the middle
 *  with floating cards anchored around it — left: AI advice + profile +
 *  a small rental card; right: tenant score + a full rental card.
 *
 *  Mobile: tabs (full width) → cards stacked → the phone below
 *  (matches the mobile screenshot order).
 *
 *  Card content is composed from small components under landing/cards/.
 */
</script>

<template>
  <section class="relative overflow-hidden bg-background">
    <div class="mx-auto max-w-[1320px] px-4 sm:px-6 pt-6 pb-16 md:pb-24">
      <!-- Audience tabs -->
      <div class="flex justify-center">
        <LandingAudienceTabs class="max-w-xl" />
      </div>

      <!-- ===================== MOBILE (stacked) ===================== -->
      <div class="mt-8 space-y-4 lg:hidden">
        <LandingCardsAiAdviceCard />
        <LandingCardsScoreCard />
        <LandingCardsProfileCard />
        <LandingCardsMiniRentalCard />
        <div class="pt-4">
          <LandingPhoneMockup />
        </div>
      </div>

      <!-- ===================== DESKTOP (phone + floating cards) ===================== -->
      <div class="relative mt-10 hidden lg:block min-h-[820px]">
        <!-- Phone, centered -->
        <div class="relative z-10 flex justify-center">
          <LandingPhoneMockup />
        </div>

        <!-- Left column: AI advice + profile (top), mini rental (bottom) -->
        <div class="absolute left-0 top-20 w-[330px] space-y-5">
          <LandingCardsAiAdviceCard />
          <LandingCardsProfileCard />
        </div>
        <div class="absolute left-16 bottom-0 w-[290px]">
          <LandingCardsMiniRentalCard />
        </div>

        <!-- Right column: score (top), full rental (bottom) -->
        <div class="absolute right-0 top-28 w-[370px]">
          <LandingCardsScoreCard />
        </div>
        <div class="absolute right-8 bottom-0 w-[300px]">
          <LandingCardsRentalCard />
        </div>
      </div>
    </div>
  </section>
</template>
