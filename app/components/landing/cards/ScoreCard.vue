<script setup lang="ts">
/**
 * Floating tenant-score card: the gauge is the `scoring-indicator.svg`
 * asset, and the score / name / tag / blurb are dynamic.
 *
 * By default the copy follows the page audience toggle — the owner sees a
 * "trusted tenant" card, the tenant sees their own score. Any of the values
 * can still be overridden via props so the card is reusable elsewhere.
 */
const { t } = useI18n()
const { isOwner } = useAudience()

const props = defineProps<{
  score?: number
  max?: number
  name?: string
  tagKey?: string
  blurbKey?: string
}>()

// Audience-driven defaults (overridden by any prop that is passed in).
const base = computed(() =>
  isOwner.value ? 'landing.hero.cards.score.owner' : 'landing.hero.cards.score.tenant'
)

const score = computed(() => props.score ?? 86)
const max = computed(() => props.max ?? 100)
const name = computed(() => props.name ?? t(`${base.value}.name`))
const tag = computed(() => t(props.tagKey ?? `${base.value}.tag`))
const blurb = computed(() => t(props.blurbKey ?? `${base.value}.blurb`))
</script>

<template>
  <div class="flex items-center gap-4 rounded-2xl bg-surface p-5 shadow-card">
    <!-- Gauge image with the score laid over the arc -->
    <div class="relative shrink-0 w-[100px]">
      <img
        src="/landing/scoring-indicator.svg"
        alt=""
        class="w-full"
      >
      <!-- The arc sits in the upper ~75% of the SVG; center the score inside it -->
      <div class="absolute inset-x-0 top-[42%] text-center">
        <p class="text-lg font-extrabold text-neutral-900 leading-none">
          {{ score }}<span class="text-[11px] font-medium text-neutral-400">/{{ max }}</span>
        </p>
        <p class="mt-1 text-[9px] leading-tight text-neutral-400">
          {{ tag }}
        </p>
      </div>
    </div>

    <!-- Text -->
    <div class="min-w-0">
      <p class="font-bold text-neutral-900">
        {{ name }}
      </p>
      <p class="text-sm text-neutral-500 leading-snug">
        {{ blurb }}
      </p>
    </div>
  </div>
</template>
