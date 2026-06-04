<script setup lang="ts">
/**
 * "Ko'p berilgan savollar" — single-open accordion. The section owns the
 * "which item is open" state; each item is a dumb, controlled child.
 */
import { faqItems } from '~/data/landing'

const { t } = useI18n()

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
        v-for="item in faqItems"
        :key="item.id"
        :item="item"
        :open="openId === item.id"
        @toggle="toggle"
      />
    </div>
  </section>
</template>
