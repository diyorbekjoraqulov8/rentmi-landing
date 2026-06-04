<script setup lang="ts">
import type { Testimonial } from '~/data/landing'

/**
 * Testimonial column (flat — no card surface, sits on the page background).
 * Circular avatar + name, then two stat groups (tenure / rating) split to the
 * edges, each `label | value` with a thin divider, a full-width rule, and the
 * quote body below. Matches the redesigned Figma slide.
 */
defineProps<{ item: Testimonial }>()

const { t } = useI18n()
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Head: avatar + name -->
    <div class="flex items-center gap-4">
      <img
        :src="item.avatar"
        :alt="item.name"
        class="size-14 shrink-0 rounded-full bg-neutral-200 object-cover"
        onerror="this.style.visibility='hidden'"
      >
      <p class="text-2xl font-bold text-neutral-900">
        {{ item.name }}
      </p>
    </div>

    <!-- Stats: tenure (left) and rating (right) -->
    <div class="mt-7 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="max-w-[72px] text-[13px] leading-tight text-neutral-400">
          {{ t(item.tenureKey) }}
        </span>
        <span class="h-8 w-px bg-neutral-200" />
        <span class="text-xl font-bold text-neutral-900">
          {{ item.tenure }} {{ t('landing.testimonials.year') }}
        </span>
      </div>
      <div class="flex items-center gap-3">
        <span class="max-w-[72px] text-[13px] leading-tight text-neutral-400">
          {{ t(item.ratingKey) }}
        </span>
        <span class="h-8 w-px bg-neutral-200" />
        <span class="text-xl font-bold text-neutral-900">
          {{ item.rating }}
        </span>
      </div>
    </div>

    <!-- Divider -->
    <div class="mt-5 h-px w-full bg-neutral-200" />

    <!-- Body -->
    <p class="mt-6 text-base leading-relaxed text-neutral-900 md:text-[17px]">
      {{ t(item.bodyKey) }}
    </p>
  </div>
</template>
