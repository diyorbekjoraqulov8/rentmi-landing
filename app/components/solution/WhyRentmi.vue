<script setup lang="ts">
/**
 * "Nega aynan Rentmi?" — a grid of feature cards, each with a tinted icon,
 * title and short description. Cards reveal with a gentle stagger. `#why-rentmi`
 * anchors the side-nav.
 */
import { whyFeatures } from '~/data/solution'

const { t } = useI18n()
</script>

<template>
  <section
    id="why-rentmi"
    class="scroll-mt-24 mt-24 md:mt-32"
  >
    <div class="container">
      <SolutionRevealOnScroll from="up">
        <h2 class="text-2xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
          {{ t('solution.why.title') }}
        </h2>
      </SolutionRevealOnScroll>

      <div class="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <SolutionRevealOnScroll
          v-for="(feature, i) in whyFeatures"
          :key="feature.titleKey"
          from="up"
          :delay="60 * (i % 3)"
        >
          <div
            class="h-full rounded-2xl bg-surface p-6 shadow-card transition-transform duration-300 hover:-translate-y-1"
          >
            <span
              class="inline-flex size-12 items-center justify-center rounded-xl bg-neutral-50"
              :class="feature.tone"
              aria-hidden="true"
            >
              <Icon
                :name="feature.icon"
                class="size-6"
              />
            </span>
            <h3 class="mt-5 text-lg font-semibold text-neutral-900">
              {{ t(feature.titleKey) }}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-neutral-600">
              {{ t(feature.descKey) }}
            </p>
          </div>
        </SolutionRevealOnScroll>
      </div>
    </div>
  </section>
</template>
