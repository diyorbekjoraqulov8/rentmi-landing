<script setup lang="ts">
import type { ManageListing } from '~/data/landing'

/**
 * Property card for the "Qanday boshqarasiz?" carousel. One component, three
 * variants (cta / rented / stats) sharing the same cover + title/price head.
 */
defineProps<{ item: ManageListing }>()

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col overflow-hidden rounded-2xl bg-surface shadow-card">
    <!-- Cover -->
    <div class="relative aspect-[4/3] bg-neutral-200">
      <img
        src="/landing/listing-penthouse.png"
        :alt="item.title"
        class="h-full w-full object-cover"
        onerror="this.style.visibility='hidden'"
      >
      <!-- vacant badge (stats variant) -->
      <span
        v-if="item.badgeKey"
        class="absolute left-3 top-3 rounded-full bg-success-600 px-3 py-1 text-xs font-medium text-white"
      >
        {{ t(item.badgeKey) }}
      </span>
      <!-- id badge (rented variant) -->
      <span
        v-else
        class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-[10px] font-medium text-white backdrop-blur"
      >
        <Icon
          name="lucide:hash"
          class="size-3"
        />1324565345
      </span>
      <!-- more menu (cta) -->
      <button
        v-if="item.variant === 'cta'"
        type="button"
        class="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full bg-white/90 text-neutral-600"
        aria-label="menu"
      >
        <IconsDotsHorizontal class="size-4" />
      </button>
      <!-- area/floor (non-cta) -->
      <span
        v-else
        class="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-md bg-black/55 px-2 py-1 text-[10px] text-white backdrop-blur"
      >
        <span class="flex items-center gap-1"><Icon
          name="lucide:scan"
          class="size-3"
        />{{ item.area }}</span>
        <span class="flex items-center gap-1"><Icon
          name="lucide:layers"
          class="size-3"
        />{{ item.floor }}</span>
      </span>
    </div>

    <!-- Body -->
    <div class="flex flex-1 flex-col p-4">
      <p class="font-semibold text-neutral-900">
        {{ item.title }}
      </p>
      <p class="mt-1 flex items-center gap-1 text-xs text-neutral-500">
        <IconsMapPin class="size-3.5 shrink-0" />
        {{ t(item.addressKey) }}
      </p>

      <div class="mt-2 flex items-center justify-between">
        <p class="font-bold text-neutral-900">
          {{ item.price }} <span class="text-xs font-normal text-neutral-400">/ {{ t('landing.listings.perMonth') }}</span>
        </p>
        <span
          v-if="item.variant === 'rented'"
          class="text-xs text-neutral-400"
        >{{ item.paid }}/{{ item.total }} oy</span>
      </div>

      <!-- CTA variant -->
      <BaseButton
        v-if="item.variant === 'cta'"
        block
        class="mt-4"
      >
        {{ t('landing.manage.publish') }}
      </BaseButton>

      <!-- RENTED variant -->
      <template v-else-if="item.variant === 'rented'">
        <div class="mt-3 flex gap-1">
          <span
            v-for="i in item.total"
            :key="i"
            class="h-1.5 flex-1 rounded-full"
            :class="i <= (item.paid ?? 0) ? 'bg-success-500' : 'bg-neutral-200'"
          />
        </div>
        <div class="mt-3">
          <p class="text-xs text-neutral-400">
            {{ t('landing.hero.cards.rental.tenant') }}
          </p>
          <div class="mt-1 flex items-center gap-2">
            <img
              src="/landing/avatar-tenant.png"
              :alt="item.tenant"
              class="size-6 rounded-full object-cover bg-neutral-200"
              onerror="this.style.visibility='hidden'"
            >
            <span class="text-sm font-medium text-neutral-900">{{ item.tenant }}</span>
          </div>
        </div>
        <dl class="mt-3 space-y-1.5 border-t border-neutral-100 pt-3 text-xs">
          <div class="flex justify-between">
            <dt class="text-neutral-400">
              {{ t('landing.hero.cards.rental.contractDate') }}
            </dt>
            <dd class="font-medium text-neutral-900">
              2-Avgust, 2025
            </dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-neutral-400">
              {{ t('landing.hero.cards.rental.nextPayment') }}
            </dt>
            <dd class="font-medium text-neutral-900">
              3-Aprel, 2025
            </dd>
          </div>
        </dl>
      </template>

      <!-- STATS variant -->
      <dl
        v-else
        class="mt-4 grid grid-cols-3 gap-2 border-t border-neutral-100 pt-4"
      >
        <div
          v-for="s in item.stats"
          :key="s.labelKey"
        >
          <dt class="text-[11px] text-neutral-400">
            {{ t(s.labelKey) }}
          </dt>
          <dd class="mt-1 flex items-center gap-1 text-sm font-semibold text-neutral-900">
            {{ s.value }}
            <AppIcon
              :name="s.icon"
              class="size-3.5 text-neutral-400"
            />
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>
