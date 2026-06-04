<script setup lang="ts">
/**
 * Floating "Yordam va qo'llab-quvvatlash" card shown around the tenant hero
 * phone. Headset icon in a soft brand tile + title + supporting blurb.
 */
const { t } = useI18n()
</script>

<template>
  <div class="rounded-2xl bg-surface p-4 shadow-card w-full">
    <span class="inline-flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
      <IconsHeadset class="size-6" />
    </span>
    <p class="mt-3 font-semibold text-neutral-900">
      {{ t('landing.hero.cards.support.title') }}
    </p>
    <p class="mt-1 text-sm leading-snug text-neutral-500">
      {{ t('landing.hero.cards.support.body') }}
    </p>
  </div>
</template>
