<script setup lang="ts">
/**
 * Floating verified-profile card: avatar + MyID badge, phone row, marital row.
 * Avatar image: public/landing/avatar-owner.webp (placeholder until provided).
 */
const { t } = useI18n()
</script>

<template>
  <div class="rounded-2xl bg-surface p-4 shadow-card w-full">
    <!-- Header: avatar + name + verified -->
    <div class="flex items-center gap-3">
      <div class="relative shrink-0">
        <img
          src="/landing/profile-4.webp"
          alt="Murod Talipov"
          class="size-11 rounded-full object-cover bg-neutral-200"
          onerror="this.style.visibility = 'hidden'" />
        <span
          class="absolute -bottom-0.5 -right-0.5 inline-flex size-4 items-center justify-center rounded-full bg-success-600 ring-2 ring-white">
          <Icon name="lucide:check" class="size-2.5 text-white" />
        </span>
      </div>
      <div>
        <p class="font-semibold text-neutral-900 leading-tight">
          Murod Talipov
        </p>
        <p class="text-sm text-success-600">
          {{ t('landing.hero.cards.profile.verified') }}
        </p>
      </div>
    </div>

    <!-- Rows -->
    <dl class="mt-4 space-y-3 text-sm">
      <div class="flex items-center justify-between">
        <dt class="text-neutral-500">
          {{ t('landing.hero.cards.profile.phone') }}
        </dt>
        <dd class="flex items-center gap-1.5 font-medium text-neutral-900">
          93 484 70 50
          <IconsCheckBadge class="size-4 text-success-600" />
        </dd>
      </div>
      <div class="flex items-center justify-between">
        <dt class="text-neutral-500">
          {{ t('landing.hero.cards.profile.marital') }}
        </dt>
        <dd>
          <span
            class="inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 px-2.5 py-1 text-neutral-600">
            {{ t('landing.hero.cards.profile.upload') }}
            <IconsShare class="size-3.5" />
          </span>
        </dd>
      </div>
    </dl>
  </div>
</template>
