<script setup lang="ts">
import type { Listing } from '~/data/landing'

/** Single property card used in the listings carousel. */
defineProps<{ listing: Listing }>()

const { t } = useI18n()
</script>

<template>
  <BaseCard
    :padded="false"
    hover
    class="flex flex-col"
  >
    <!-- Image placeholder -->
    <div class="relative aspect-[4/3] bg-neutral-200">
      <div class="absolute inset-0 flex items-center justify-center text-neutral-400">
        <Icon
          name="lucide:image"
          class="size-10"
        />
      </div>
      <span
        v-if="listing.badgeKey"
        class="absolute left-3 top-3 rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-white"
      >
        {{ t(listing.badgeKey) }}
      </span>
      <button
        type="button"
        class="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full bg-white/90 text-neutral-600 hover:text-brand-600"
        :aria-label="t('landing.listings.favorite')"
      >
        <IconsHeart class="size-4" />
      </button>
    </div>

    <!-- Body -->
    <div class="p-4 flex flex-col gap-2">
      <p class="font-semibold text-neutral-900 line-clamp-1">
        {{ t(listing.titleKey) }}
      </p>
      <p class="flex items-center gap-1 text-sm text-neutral-500 line-clamp-1">
        <IconsMapPin class="size-4 shrink-0" />
        {{ t(listing.addressKey) }}
      </p>

      <div class="flex items-center gap-4 text-sm text-neutral-500">
        <span
          v-for="m in listing.meta"
          :key="m.icon"
          class="flex items-center gap-1"
        >
          <AppIcon
            :name="m.icon"
            class="size-4"
          />
          {{ t(m.valueKey) }}
        </span>
      </div>

      <p class="mt-2 text-lg font-bold text-brand-600">
        {{ listing.price }}<span class="text-sm font-normal text-neutral-500"> / {{ t('landing.listings.perMonth') }}</span>
      </p>
    </div>
  </BaseCard>
</template>
