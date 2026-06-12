<script setup lang="ts">
import { stats } from '~/data/landing'

const { t } = useI18n()
</script>

<template>
  <section id="about">
    <div class="container">
      <div class="max-w-4xl">
        <h2 class="text-xl md:text-2xl font-bold text-neutral-900">
          {{ t('landing.about.title') }}
        </h2>

        <LandingScrollRevealText
          :text="t('landing.about.body')"
          class="mt-8 text-3xl md:text-[2.5rem] md:leading-[1.25] font-normal text-neutral-900" />
      </div>

      <!-- Stats -->
      <dl
        class="mt-16 md:mt-20 grid grid-cols-1 gap-10 sm:grid-cols-3 max-w-3xl">
        <div
          v-for="stat in stats"
          :key="stat.labelKey"
          class="flex flex-col h-full">
          <dt class="text-sm md:text-base text-neutral-500">
            {{ t(stat.labelKey) }}
          </dt>
          <dd
            class="mt-auto pt-2 text-4xl md:text-5xl font-medium text-brand-600">
            <LandingCountUp :value="stat.value" />
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
