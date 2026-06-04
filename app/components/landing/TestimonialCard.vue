<script setup lang="ts">
import type { Testimonial } from '~/data/landing'

/** Testimonial card: avatar + name, two meta columns, then the quote body. */
defineProps<{ item: Testimonial }>()

const { t } = useI18n()
</script>

<template>
  <div class="flex h-full flex-col rounded-3xl bg-surface p-7 shadow-card">
    <!-- Head: avatar + name -->
    <div class="flex items-center gap-4">
      <img
        :src="item.avatar"
        :alt="item.name"
        class="size-14 rounded-2xl object-cover bg-neutral-200"
        onerror="this.style.visibility='hidden'"
      >
      <p class="text-xl font-bold text-neutral-900">
        {{ item.name }}
      </p>
    </div>

    <!-- Meta: tenure + rating -->
    <div class="mt-6 flex items-center gap-8">
      <div class="flex items-center gap-2">
        <span class="max-w-[80px] text-xs leading-tight text-neutral-400">{{ t(item.tenureKey) }}</span>
        <span class="text-lg font-bold text-neutral-900">{{ item.tenure }} {{ t('landing.testimonials.year') }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="max-w-[80px] text-xs leading-tight text-neutral-400">{{ t(item.ratingKey) }}</span>
        <span class="text-lg font-bold text-neutral-900">{{ item.rating }}</span>
      </div>
    </div>

    <!-- Body -->
    <p class="mt-6 text-base leading-relaxed text-neutral-900">
      {{ t(item.bodyKey) }}
    </p>
  </div>
</template>
