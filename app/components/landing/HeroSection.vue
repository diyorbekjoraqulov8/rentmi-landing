<script setup lang="ts">
/**
 * Hero — matches the Figma "Website" hero for both audience tabs.
 *
 *  Audience tabs sit centered on top; the app phone is the anchor in the
 *  middle, with floating cards arranged around it. Each tab has its OWN
 *  phone screen and its OWN set of surrounding cards:
 *
 *    owner  → AI advice · verified profile · mini rental | tenant score · rental
 *    tenant → support · listing | price filter · property type
 *
 *  Every floating element is wrapped in <LandingFloatingCard>: it rises into
 *  place on load (staggered) and then bobs gently forever. Switching tabs
 *  remounts the set, so the rise replays for the new audience.
 *
 *  Mobile: tabs (full width) → cards stacked → phone, in the screenshot order.
 */
const { isOwner } = useAudience()

const phoneSrc = computed(() =>
  isOwner.value ? '/landing/hero-phone.png' : '/landing/hero-phone-2.png'
)
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
        <template v-if="isOwner">
          <LandingFloatingCard :delay="60">
            <LandingCardsAiAdviceCard />
          </LandingFloatingCard>
          <LandingFloatingCard :delay="140">
            <LandingCardsProfileCard />
          </LandingFloatingCard>
          <LandingFloatingCard :delay="220">
            <LandingCardsScoreCard />
          </LandingFloatingCard>
          <LandingFloatingCard :delay="300">
            <LandingCardsMiniRentalCard />
          </LandingFloatingCard>
        </template>
        <template v-else>
          <LandingFloatingCard :delay="60">
            <LandingCardsSupportCard />
          </LandingFloatingCard>
          <LandingFloatingCard :delay="140">
            <LandingCardsPriceFilterCard />
          </LandingFloatingCard>
          <LandingFloatingCard :delay="220">
            <LandingCardsPropertyTypeCard />
          </LandingFloatingCard>
          <LandingFloatingCard :delay="300" class="mx-auto max-w-[240px]">
            <LandingCardsMiniListingCard />
          </LandingFloatingCard>
        </template>
        <div class="pt-4">
          <LandingPhoneMockup :src="phoneSrc" />
        </div>
      </div>

      <!-- ============== DESKTOP (phone + floating cards) ============== -->
      <div class="relative mt-10 hidden lg:block min-h-[800px]">
        <!-- Phone, centered (entrance only, no bob — it's the anchor) -->
        <div class="relative z-20 flex justify-center">
          <LandingFloatingCard :float="false">
            <LandingPhoneMockup :src="phoneSrc" />
          </LandingFloatingCard>
        </div>

        <!-- ===== OWNER card set ===== -->
        <template v-if="isOwner">
          <div class="absolute left-28 top-12 z-10 w-[280px]">
            <LandingFloatingCard :delay="100" :amplitude="9" :duration="6.5">
              <LandingCardsAiAdviceCard />
            </LandingFloatingCard>
          </div>
          <div class="absolute left-22 top-50 z-10 w-[330px]">
            <LandingFloatingCard :delay="200" :amplitude="12" :duration="7.5">
              <LandingCardsProfileCard />
            </LandingFloatingCard>
          </div>
          <div class="absolute left-30 top-110 z-10 w-[270px]">
            <LandingFloatingCard :delay="320" :amplitude="10" :duration="6.8">
              <LandingCardsMiniRentalCard />
            </LandingFloatingCard>
          </div>

          <div class="absolute right-0 top-16 z-10 w-[360px]">
            <LandingFloatingCard :delay="160" :amplitude="11" :duration="7">
              <LandingCardsScoreCard />
            </LandingFloatingCard>
          </div>
          <div class="absolute right-22 top-64 z-10 w-[300px]">
            <LandingFloatingCard :delay="280" :amplitude="13" :duration="8">
              <LandingCardsRentalCard />
            </LandingFloatingCard>
          </div>
        </template>

        <!-- ===== TENANT card set ===== -->
        <template v-else>
          <div class="absolute left-13 top-24 z-10 w-[300px]">
            <LandingFloatingCard :delay="100" :amplitude="10" :duration="6.8">
              <LandingCardsSupportCard />
            </LandingFloatingCard>
          </div>
          <div class="absolute left-26 bottom-40 z-10 w-[210px]">
            <LandingFloatingCard :delay="300" :amplitude="12" :duration="7.6">
              <LandingCardsMiniListingCard />
            </LandingFloatingCard>
          </div>

          <div class="absolute right-10 top-40 z-10 w-[330px]">
            <LandingFloatingCard :delay="160" :amplitude="11" :duration="7.2">
              <LandingCardsPriceFilterCard />
            </LandingFloatingCard>
          </div>
          <div class="absolute right-6 bottom-50 z-10 w-[300px]">
            <LandingFloatingCard :delay="240" :amplitude="9" :duration="6.4">
              <LandingCardsPropertyTypeCard />
            </LandingFloatingCard>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
