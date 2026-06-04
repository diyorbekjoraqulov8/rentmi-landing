<script setup lang="ts">
/**
 * "Afzalliklarimiz" — heading + audience tabs, then a two-column block:
 *  left  = a list of feature rows (round brand icon, title, optional desc,
 *          separated by hairlines)
 *  right = the tenant score-detail panel illustration.
 */
import { features } from '~/data/landing'

const { t } = useI18n()
</script>

<template>
  <section
    id="features"
    class="bg-background"
  >
    <div class="mx-auto max-w-[1320px] px-4 sm:px-6 py-20 md:py-28">
      <h2 class="text-2xl md:text-3xl font-bold text-neutral-900">
        {{ t('landing.features.title') }}
      </h2>

      <div class="mt-6">
        <LandingAudienceTabs class="max-w-md" />
      </div>

      <div class="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-start">
        <!-- Feature list -->
        <ul>
          <li
            v-for="(feature, i) in features"
            :key="feature.titleKey"
            class="py-8 first:pt-0"
            :class="i < features.length - 1 ? 'border-b border-neutral-200' : ''"
          >
            <span class="inline-flex size-11 items-center justify-center rounded-full bg-brand-600 text-white">
              <AppIcon
                :name="feature.icon"
                class="size-5"
              />
            </span>
            <h3 class="mt-5 text-2xl font-bold text-neutral-900">
              {{ t(feature.titleKey) }}
            </h3>
            <p
              v-if="feature.descKey"
              class="mt-3 max-w-xl text-base leading-relaxed text-neutral-500"
            >
              {{ t(feature.descKey) }}
            </p>
          </li>
        </ul>

        <!-- Score detail panel -->
        <div class="lg:sticky lg:top-24">
          <LandingCardsScoreDetailPanel />
        </div>
      </div>
    </div>
  </section>
</template>
