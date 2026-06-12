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
 *  place on load (staggered), then bobs forever on a lopsided figure-8 and
 *  trails the scroll like something suspended in water. Each card gets its own
 *  amplitude/sway/tilt/drift so the set never moves as one rigid plank —
 *  left-side cards lean one way, right-side cards the other, light cards react
 *  to scroll more than heavy ones, and the phone barely stirs (it is the
 *  anchor). Switching tabs remounts the set, so the rise replays.
 *
 *  Mobile: tabs (full width) → cards stacked → phone, in the screenshot order.
 */
const { t } = useI18n()
const { isOwner } = useAudience()

const phoneSrc = computed(() =>
  isOwner.value ? '/landing/hero-phone.webp' : '/landing/hero-phone-2.webp'
)
</script>

<template>
  <section
    id="hero"
    class="relative overflow-hidden bg-background mb-12 lg:mb-20"
    aria-labelledby="hero-heading">
    <!-- Primary page heading. The hero is visual (phone + cards), so the
         SEO/a11y H1 is rendered for assistive tech and crawlers. -->
    <h1 id="hero-heading" class="sr-only">
      {{ t('landing.hero.h1') }}
    </h1>

    <!-- ===================== MOBILE (stacked) ===================== -->
    <!-- The audience pill sits in flow just above (sticky), so the hero only
         needs a modest gap below it. -->
    <div class="mx-auto max-w-[1320px] px-4 sm:px-6 pt-8 pb-16 lg:hidden">
      <div class="space-y-4">
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
          <LandingPhoneMockup :src="phoneSrc" priority />
        </div>
      </div>
    </div>

    <div
      class="relative mx-auto hidden w-full max-w-[1180px] px-6 pt-12 lg:block">
      <!-- The audience pill (LandingFloatingAudienceTabs) is sticky in flow just
           above this section, so only a modest gap is needed before the phone. -->

      <!-- Stage holds the phone + the cards arranged around it. Fixed height so
           the phone's base overflows it and the section's overflow-hidden clips
           the bottom — the phone's base is never shown, at any width. -->
      <div class="relative h-[560px]">
        <!-- Phone, top-aligned centerpiece. It is the heaviest object in the
             water: a barely-there bob and the smallest scroll drift, so it
             anchors the scene while still belonging to it. -->
        <div class="absolute left-1/2 top-0 z-20 -translate-x-1/2">
          <LandingFloatingCard
            :amplitude="4"
            :duration="11"
            :sway="2"
            :tilt="0.15"
            :drift="0.04">
            <LandingPhoneMockup :src="phoneSrc" priority size="hero" />
          </LandingFloatingCard>
        </div>

        <!-- ===== OWNER card set ===== -->
        <template v-if="isOwner">
          <div class="absolute left-24 top-24 z-10 w-[270px]">
            <LandingFloatingCard
              :delay="100"
              :amplitude="9"
              :duration="6.5"
              :sway="7"
              :tilt="-0.9"
              :drift="0.13">
              <LandingCardsAiAdviceCard />
            </LandingFloatingCard>
          </div>
          <div class="absolute left-16 top-[232px] z-10 w-[320px]">
            <LandingFloatingCard
              :delay="200"
              :amplitude="12"
              :duration="7.5"
              :sway="-5"
              :tilt="-0.6"
              :drift="0.08">
              <LandingCardsProfileCard />
            </LandingFloatingCard>
          </div>
          <div class="absolute left-28 top-[440px] z-10 w-[260px]">
            <LandingFloatingCard
              :delay="320"
              :amplitude="10"
              :duration="6.8"
              :sway="5"
              :tilt="-1.1"
              :drift="0.16">
              <LandingCardsMiniRentalCard />
            </LandingFloatingCard>
          </div>

          <div class="absolute right-20 top-28 z-10 w-[330px]">
            <LandingFloatingCard
              :delay="160"
              :amplitude="11"
              :duration="7"
              :sway="-7"
              :tilt="0.9"
              :drift="0.11">
              <LandingCardsScoreCard />
            </LandingFloatingCard>
          </div>
          <div class="absolute right-16 top-[252px] z-10 w-[300px]">
            <LandingFloatingCard
              :delay="280"
              :amplitude="13"
              :duration="8"
              :sway="6"
              :tilt="0.7"
              :drift="0.14">
              <LandingCardsRentalCard />
            </LandingFloatingCard>
          </div>
        </template>

        <!-- ===== TENANT card set ===== -->
        <template v-else>
          <div class="absolute left-16 top-24 z-10 w-[300px]">
            <LandingFloatingCard
              :delay="100"
              :amplitude="10"
              :duration="6.8"
              :sway="6"
              :tilt="-0.8"
              :drift="0.12">
              <LandingCardsSupportCard />
            </LandingFloatingCard>
          </div>
          <div class="absolute left-28 top-[360px] z-10 w-[210px]">
            <LandingFloatingCard
              :delay="300"
              :amplitude="12"
              :duration="7.6"
              :sway="-5"
              :tilt="-1.2"
              :drift="0.16">
              <LandingCardsMiniListingCard />
            </LandingFloatingCard>
          </div>

          <div class="absolute right-16 top-28 z-10 w-[330px]">
            <LandingFloatingCard
              :delay="160"
              :amplitude="11"
              :duration="7.2"
              :sway="-7"
              :tilt="0.9"
              :drift="0.1">
              <LandingCardsPriceFilterCard />
            </LandingFloatingCard>
          </div>
          <div class="absolute right-20 top-[332px] z-10 w-[300px]">
            <LandingFloatingCard
              :delay="240"
              :amplitude="9"
              :duration="6.4"
              :sway="5"
              :tilt="0.7"
              :drift="0.14">
              <LandingCardsPropertyTypeCard />
            </LandingFloatingCard>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
