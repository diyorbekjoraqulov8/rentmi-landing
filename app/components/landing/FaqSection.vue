<script setup lang="ts">
/**
 * "Ko'p berilgan savollar" — single-open accordion. The section owns the
 * "which item is open" state; each item is a dumb, controlled child.
 *
 * Content comes from the backend (`useFaqs`, prefetched in the background
 * after hydration); until that lands — or if it fails — the static i18n
 * items render instead.
 */
import { faqItems } from '~/data/landing'
import type { Faq } from '~/composables/useFaqs'

const { t } = useI18n()
const { faqs } = useFaqs()

const items = computed<Faq[]>(() =>
  faqs.value
  ?? faqItems.map(item => ({
    id: item.id,
    question: t(item.questionKey),
    answer: t(item.answerKey)
  }))
)

// All collapsed by default (matches the design).
const openId = ref<number | null>(null)

const toggle = (id: number) => {
  openId.value = openId.value === id ? null : id
}
</script>

<template>
  <section
    id="faq"
    class="mx-auto max-w-3xl px-4 py-16 md:py-24"
  >
    <BaseSectionHeading
      :title="t('landing.faq.title')"
      align="center"
    />

    <div class="mt-10 space-y-3">
      <LandingFaqAccordionItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        :open="openId === item.id"
        @toggle="toggle"
      />
    </div>

    <!-- Traveling-pill landing spot: centered below the questions.
         Desktop only — on mobile the pill stays with the hero. -->
    <div class="mt-12 hidden justify-center lg:flex">
      <LandingAudiencePillAnchor :order="5" />
    </div>
  </section>
</template>
