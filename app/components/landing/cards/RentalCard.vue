<script setup lang="ts">
/**
 * Floating detailed rental card: cover image + id badge, title/address,
 * price, payment-progress bar, tenant row, contract/next-payment dates.
 *
 * Cover image: public/landing/listing-penthouse.png (placeholder until given).
 */
const { t } = useI18n()

// 6 of 8 months paid → progress segments
const paid = 6
const total = 8
</script>

<template>
  <div class="overflow-hidden rounded-2xl bg-surface shadow-card w-full">
    <!-- Cover -->
    <div class="relative aspect-[16/9] bg-neutral-200">
      <img
        src="/landing/mirabad-square.png"
        alt="Mirabad Square Penthouse"
        loading="lazy"
        class="h-full w-full object-cover"
        onerror="this.style.visibility = 'hidden'" />
      <span
        class="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-[10px] font-medium text-white backdrop-blur">
        <Icon name="lucide:hash" class="size-3" />1324565345
      </span>
      <span
        class="absolute bottom-2 right-2 inline-flex items-center gap-2 rounded-md bg-black/55 px-2 py-1 text-[10px] text-white backdrop-blur">
        <span class="flex items-center gap-1"
          ><Icon name="lucide:scan" class="size-3" />185m²</span
        >
        <span class="flex items-center gap-1"
          ><Icon name="lucide:layers" class="size-3" />12/12</span
        >
      </span>
    </div>

    <!-- Body -->
    <div class="p-4 space-y-3">
      <div>
        <p class="font-semibold text-neutral-900">Mirabad Square | Penthouse</p>
        <p class="flex items-center gap-1 text-xs text-neutral-500">
          <IconsMapPin class="size-3.5 shrink-0" />
          Toshkent, Mirobod t. Mirobod Avenue, Block D, 34
        </p>
      </div>

      <div class="flex items-center justify-between">
        <p class="font-bold text-neutral-900">
          24,5 mln so'm
          <span class="text-xs font-normal text-neutral-400">/ oyiga</span>
        </p>
        <span class="text-xs text-neutral-400">{{ paid }}/{{ total }} oy</span>
      </div>

      <!-- Progress segments -->
      <div class="flex gap-1">
        <span
          v-for="i in total"
          :key="i"
          class="h-1.5 flex-1 rounded-full"
          :class="i <= paid ? 'bg-success-500' : 'bg-neutral-200'" />
      </div>

      <!-- Tenant -->
      <div>
        <p class="text-xs text-neutral-400">
          {{ t('landing.hero.cards.rental.tenant') }}
        </p>
        <div class="mt-1 flex items-center gap-2">
          <img
            src="/landing/avatar-tenant.png"
            alt="Abdullayev Sarvar"
            class="size-6 rounded-full object-cover bg-neutral-200"
            onerror="this.style.visibility = 'hidden'" />
          <span class="text-sm font-medium text-neutral-900"
            >Abdullayev Sarvar</span
          >
        </div>
      </div>

      <!-- Dates -->
      <dl class="space-y-1.5 border-t border-neutral-100 pt-3 text-xs">
        <div class="flex justify-between">
          <dt class="text-neutral-400">
            {{ t('landing.hero.cards.rental.contractDate') }}
          </dt>
          <dd class="font-medium text-neutral-900">2-Avgust, 2025</dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-neutral-400">
            {{ t('landing.hero.cards.rental.nextPayment') }}
          </dt>
          <dd class="font-medium text-neutral-900">3-Aprel, 2025</dd>
        </div>
      </dl>
    </div>
  </div>
</template>
