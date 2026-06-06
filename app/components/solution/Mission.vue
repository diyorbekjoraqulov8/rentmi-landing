<script setup lang="ts">
/**
 * "Missiyamiz · Bizning qarashimiz · Qadriyatlarimiz" — three staggered columns
 * laid out as a descending staircase. Each reveals on scroll one after another,
 * and each carries its own id (#mission, #vision, #values) so the side-nav
 * highlights them in turn as the reader scrolls past.
 */
import { values } from '~/data/solution'

const { t } = useI18n()
</script>

<template>
  <section class="mt-24 md:mt-32">
    <div class="container">
      <div class="grid gap-12 md:grid-cols-3 md:gap-8">
        <!-- Mission -->
        <SolutionRevealOnScroll
          id="mission"
          from="left"
          class="scroll-mt-28"
        >
          <h2 class="text-2xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            {{ t('solution.mission.title') }}
          </h2>
          <p class="mt-4 max-w-xs text-base leading-relaxed text-neutral-600">
            {{ t('solution.mission.body') }}
          </p>
        </SolutionRevealOnScroll>

        <!-- Vision (stepped down on desktop) -->
        <SolutionRevealOnScroll
          id="vision"
          from="up"
          :delay="80"
          class="scroll-mt-28 md:mt-24"
        >
          <h2 class="text-2xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            {{ t('solution.vision.title') }}
          </h2>
          <p class="mt-4 max-w-xs text-base leading-relaxed text-neutral-600">
            {{ t('solution.vision.body') }}
          </p>
        </SolutionRevealOnScroll>

        <!-- Values (stepped down further) -->
        <SolutionRevealOnScroll
          id="values"
          from="right"
          :delay="160"
          class="scroll-mt-28 md:mt-48"
        >
          <h2 class="text-2xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            {{ t('solution.values.title') }}
          </h2>
          <ul class="mt-5 flex flex-col gap-3">
            <li
              v-for="item in values"
              :key="item.titleKey"
              class="text-base leading-relaxed text-neutral-600"
            >
              <span class="font-semibold text-neutral-900">{{ t(item.titleKey) }}</span>
              — {{ t(item.descKey) }}
            </li>
          </ul>
        </SolutionRevealOnScroll>
      </div>
    </div>
  </section>
</template>
