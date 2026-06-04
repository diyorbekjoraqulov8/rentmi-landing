<script setup lang="ts">
/**
 * "Biz haqimizda" — small bold heading, a large light-grey lead paragraph,
 * then a three-up KPI stat row (big brand-blue numbers).
 */
import { stats } from '~/data/landing'

const { t } = useI18n()
</script>

<template>
  <section
    id="about"
    class="bg-background"
  >
    <div class="mx-auto max-w-[1320px] px-4 sm:px-6 py-20 md:py-28">
      <div class="max-w-4xl">
        <h2 class="text-xl md:text-2xl font-bold text-neutral-900">
          {{ t('landing.about.title') }}
        </h2>

        <p class="mt-8 text-3xl md:text-[2.5rem] md:leading-[1.25] font-normal text-neutral-500">
          {{ t('landing.about.body') }}
        </p>
      </div>

      <!-- Stats -->
      <dl class="mt-16 md:mt-20 grid grid-cols-1 gap-10 sm:grid-cols-3 max-w-3xl">
        <div
          v-for="stat in stats"
          :key="stat.labelKey"
        >
          <dt class="text-sm md:text-base text-neutral-500">
            {{ t(stat.labelKey) }}
          </dt>
          <dd class="mt-2 text-4xl md:text-5xl font-bold text-brand-600">
            {{ stat.value }}
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
