<script setup lang="ts">
/**
 * "Afzalliklarimiz" — heading + audience tabs, then an interactive two-column
 * block:
 *   left  = a list of feature rows. Exactly one row is "active" at a time; the
 *           active row darkens, reveals its description (smooth height) and a
 *           moving accent bar marks it.
 *   right = a sticky illustration that crossfades to the active row's panel.
 *
 * Activation is driven two ways and they cooperate:
 *   • hover — pointing at a row activates it immediately (takes precedence).
 *   • scroll — with no hover, the row nearest a line ~42% down the viewport
 *     becomes active, so the panels advance one-by-one as the page scrolls.
 */
import { features, tenantFeatures } from '~/data/landing'

const { t } = useI18n()
const { isOwner } = useAudience()

/** The row set swaps with the audience tab (owner vs tenant). */
const items = computed(() => (isOwner.value ? features : tenantFeatures))

const scrollIndex = ref(0)
const hoverIndex = ref<number | null>(null)
/** hover wins; otherwise follow the scroll position. */
const active = computed(() => hoverIndex.value ?? scrollIndex.value)
const activePanel = computed(() => items.value[active.value]?.panel)

/**
 * Mobile renders an accordion instead of the two-column hover/scroll layout:
 * each feature shows its title; the open one reveals its description AND its
 * illustration inline beneath it (the desktop "right panel" moved in-row).
 */
const mobileOpen = ref(0)
// Switching audience swaps the rows — reopen the first one.
watch(isOwner, () => {
  mobileOpen.value = 0
})

/**
 * Desktop pins the whole block while you scroll through it: a tall `wrapper`
 * supplies the scroll distance, an inner `sticky top-0 h-screen` element stays
 * put, and the scroll progress *inside* that pinned range maps 1:1 onto the
 * active card. Each card owns an equal slice of the pin, so they open one by
 * one; once the last slice is past, the sticky releases and the page scrolls
 * on normally. STEP_VH is the scroll distance (in vh) spent per card — bigger
 * means the section "holds" longer before advancing.
 */
const STEP_VH = 70
const wrapper = ref<HTMLElement>()
const wrapperStyle = computed(() => ({
  height: `${100 + items.value.length * STEP_VH}vh`,
}))

let raf = 0
function measure() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    if (hoverIndex.value !== null || !wrapper.value) return
    const rect = wrapper.value.getBoundingClientRect()
    const total = rect.height - window.innerHeight // scrollable while pinned
    if (total <= 0) {
      scrollIndex.value = 0
      return
    }
    const p = Math.min(1, Math.max(0, -rect.top / total))
    const n = items.value.length
    scrollIndex.value = Math.min(n - 1, Math.floor(p * n))
  })
}

const onLeave = () => {
  hoverIndex.value = null
  measure()
}

// Switching audience swaps the rows — drop any hover and re-measure so the
// active row/panel matches the new set.
watch(isOwner, () => {
  hoverIndex.value = null
  nextTick(measure)
})

onMounted(() => {
  window.addEventListener('scroll', measure, { passive: true })
  window.addEventListener('resize', measure, { passive: true })
  measure()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('scroll', measure)
  window.removeEventListener('resize', measure)
})
</script>

<template>
  <section id="features" class="bg-background">
    <div class="container py-14 md:py-28">
      <h2 class="text-2xl md:text-3xl font-bold text-neutral-900 lg:hidden">
        {{ t('landing.features.title') }}
      </h2>
      <!-- Audience tabs live in the global floating pill (LandingFloatingAudienceTabs). -->

      <!-- ===================== MOBILE (accordion) ===================== -->
      <div class="mt-10 lg:hidden">
        <div
          v-for="(feature, i) in items"
          :key="feature.titleKey"
          class="border-b border-neutral-200 py-6 first:pt-0 last:border-0">
          <button
            type="button"
            class="flex w-full items-center gap-4 text-left"
            @click="mobileOpen = mobileOpen === i ? -1 : i">
            <span
              class="inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-colors duration-200"
              :class="
                mobileOpen === i
                  ? 'bg-brand-600 text-white'
                  : 'bg-brand-50 text-brand-600'
              ">
              <AppIcon :name="feature.icon" class="size-5" />
            </span>
            <h3
              class="text-xl font-bold transition-colors duration-200"
              :class="
                mobileOpen === i ? 'text-neutral-900' : 'text-neutral-400'
              ">
              {{ t(feature.titleKey) }}
            </h3>
          </button>

          <!-- description + illustration, revealed for the open row -->
          <div
            class="grid transition-all duration-300 ease-out"
            :class="
              mobileOpen === i
                ? 'mt-4 grid-rows-[1fr] opacity-100'
                : 'grid-rows-[0fr] opacity-0'
            ">
            <div class="overflow-hidden">
              <p class="text-base leading-relaxed text-neutral-500">
                {{ t(feature.descKey) }}
              </p>
              <div v-if="mobileOpen === i" class="mt-6">
                <!-- owner panels -->
                <LandingCardsScoreDetailPanel
                  v-if="feature.panel === 'score'" />
                <LandingFeaturesAnalyticsPanel
                  v-else-if="feature.panel === 'analytics'" />
                <LandingFeaturesContractPanel
                  v-else-if="feature.panel === 'contract'" />
                <LandingFeaturesIntegrationPanel
                  v-else-if="feature.panel === 'integration'" />
                <!-- tenant panels -->
                <LandingFeaturesFilterPanel
                  v-else-if="feature.panel === 'filter'" />
                <LandingFeaturesBestHomesPanel
                  v-else-if="feature.panel === 'bestHomes'" />
                <LandingFeaturesProfilePanel
                  v-else-if="feature.panel === 'profile'" />
                <LandingFeaturesScoringPanel
                  v-else-if="feature.panel === 'scoring'" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============ DESKTOP (pinned scroll — cards reveal one-by-one) ===========
           The tall wrapper supplies the scroll distance; the inner block pins
           (sticky, full-height, vertically centred) and the active card tracks
           how far we've scrolled through the pin. -->
      <div ref="wrapper" class="relative hidden lg:block" :style="wrapperStyle">
        <div class="sticky top-0 flex min-h-screen flex-col justify-center">
          <h2 class="mb-12 text-2xl md:text-3xl font-bold text-neutral-900">
            {{ t('landing.features.title') }}
          </h2>

          <div class="grid grid-cols-2 gap-20 items-start">
            <!-- Feature list -->
            <ul @mouseleave="onLeave">
              <li
                v-for="(feature, i) in items"
                :key="feature.titleKey"
                class="group relative cursor-default py-8 first:pt-0"
                :class="i < items.length - 1 ? 'border-b border-neutral-200' : ''"
                @mouseenter="hoverIndex = i">
                <span
                  class="inline-flex size-11 items-center justify-center rounded-full transition-colors duration-200"
                  :class="
                    active === i
                      ? 'bg-brand-600 text-white'
                      : 'bg-brand-50 text-brand-600'
                  ">
                  <AppIcon :name="feature.icon" class="size-5" />
                </span>

                <h3
                  class="mt-5 text-2xl font-bold transition-colors duration-200"
                  :class="
                    active === i ? 'text-neutral-900' : 'text-neutral-400'
                  ">
                  {{ t(feature.titleKey) }}
                </h3>

                <!-- description: smooth height via grid-rows trick -->
                <div
                  class="grid transition-all duration-300 ease-out"
                  :class="
                    active === i
                      ? 'mt-3 grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  ">
                  <div class="overflow-hidden">
                    <p
                      class="max-w-xl text-base leading-relaxed text-neutral-500">
                      {{ t(feature.descKey) }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>

            <!-- Crossfading panel -->
            <div>
              <Transition name="panel" mode="out-in">
                <div :key="activePanel" class="min-h-[420px]">
                  <!-- owner panels -->
                  <LandingCardsScoreDetailPanel
                    v-if="activePanel === 'score'" />
                  <LandingFeaturesAnalyticsPanel
                    v-else-if="activePanel === 'analytics'" />
                  <LandingFeaturesContractPanel
                    v-else-if="activePanel === 'contract'" />
                  <LandingFeaturesIntegrationPanel
                    v-else-if="activePanel === 'integration'" />
                  <!-- tenant panels -->
                  <LandingFeaturesFilterPanel
                    v-else-if="activePanel === 'filter'" />
                  <LandingFeaturesBestHomesPanel
                    v-else-if="activePanel === 'bestHomes'" />
                  <LandingFeaturesProfilePanel
                    v-else-if="activePanel === 'profile'" />
                  <LandingFeaturesScoringPanel
                    v-else-if="activePanel === 'scoring'" />
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.panel-enter-active,
.panel-leave-active {
  transition:
    opacity 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
.panel-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.985);
}
.panel-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.985);
}

@media (prefers-reduced-motion: reduce) {
  .panel-enter-active,
  .panel-leave-active {
    transition: opacity 0.2s ease;
  }
  .panel-enter-from,
  .panel-leave-to {
    transform: none;
  }
}
</style>
