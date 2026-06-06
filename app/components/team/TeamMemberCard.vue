<script setup lang="ts">
/**
 * A single team member: rounded portrait, bold name, muted role.
 * Used across the Advice board, Management and Developers grids.
 */
import type { TeamMember } from '~/data/team'

defineProps<{ member: TeamMember }>()

const { t } = useI18n()
</script>

<template>
  <figure>
    <div class="overflow-hidden rounded-2xl bg-neutral-100 shadow-card">
      <NuxtImg
        :src="member.image"
        :alt="member.name"
        class="aspect-[7/8] w-full object-cover"
        loading="lazy"
        sizes="sm:50vw md:33vw 360px" />
    </div>
    <figcaption class="mt-4">
      <p class="text-base font-bold text-neutral-900">{{ member.name }}</p>
      <p class="mt-1 text-sm text-neutral-600">{{ t(member.roleKey) }}</p>
    </figcaption>
  </figure>
</template>
