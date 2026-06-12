<script setup lang="ts">
/**
 * Shared layout for the legal pages (/terms, /privacy, /payment-refund).
 * Renders the i18n `legal.<topic>` block: title, "last updated" line, intro,
 * the numbered sections and a closing contact card. Content lives entirely in
 * i18n/locales/*.json so all three locales stay in sync.
 */
const props = defineProps<{ topic: 'terms' | 'privacy' | 'payment' }>()

const { t, tm, rt } = useI18n()

interface LegalSection { h: string, p: string }

// `tm` returns compiled message ASTs; `rt` renders each one to a string.
const sections = computed<LegalSection[]>(() =>
  ((tm(`legal.${props.topic}.sections`) ?? []) as unknown[]).map(s => ({
    h: rt((s as Record<string, never>).h),
    p: rt((s as Record<string, never>).p)
  }))
)
</script>

<template>
  <article class="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
    <p class="text-sm text-neutral-400">
      {{ t('legal.updated') }}
    </p>
    <h1
      class="mt-3 text-3xl font-bold tracking-tight text-neutral-900 md:text-5xl"
    >
      {{ t(`legal.${topic}.title`) }}
    </h1>
    <p class="mt-6 text-base leading-relaxed text-neutral-600 md:text-lg">
      {{ t(`legal.${topic}.intro`) }}
    </p>

    <div class="mt-12 space-y-10">
      <section
        v-for="(section, i) in sections"
        :key="i"
      >
        <h2 class="flex gap-3 text-xl font-semibold text-neutral-900">
          <span class="text-neutral-300">{{ i + 1 }}.</span>
          {{ section.h }}
        </h2>
        <p class="mt-3 leading-relaxed text-neutral-600">
          {{ section.p }}
        </p>
      </section>
    </div>

    <!-- Contact card -->
    <div class="mt-14 rounded-2xl bg-surface p-6 shadow-card md:p-8">
      <p class="font-semibold text-neutral-900">
        {{ t('legal.contactLead') }}
      </p>
      <div class="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <a
          href="mailto:info@rentmi.uz"
          class="text-brand-600 transition-colors hover:text-brand-700"
        >
          info@rentmi.uz
        </a>
        <a
          href="tel:+998781138878"
          class="text-brand-600 transition-colors hover:text-brand-700"
        >
          +998 78 113 88 78
        </a>
      </div>
    </div>
  </article>
</template>
