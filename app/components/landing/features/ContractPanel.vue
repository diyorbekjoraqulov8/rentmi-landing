<script setup lang="ts">
/**
 * "Contract" feature illustration: an in-app rental-contract card —
 * property head, payment-progress bar, tenant row, contract / next-payment
 * dates and a "signed by both parties" footer. Display-only mock.
 */
const { t } = useI18n()

const paid = 6
const total = 8
</script>

<template>
  <div class="w-full max-w-[340px] overflow-hidden rounded-2xl bg-surface shadow-card">
    <!-- Cover -->
    <div class="relative aspect-[16/9] bg-neutral-200">
      <img
        src="/landing/listing-penthouse.png"
        alt="Mirabad Square | Penthouse"
        class="h-full w-full object-cover"
        onerror="this.style.visibility='hidden'"
      >
      <span
        class="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-black/55 px-2 py-1 text-[10px] font-medium text-white backdrop-blur"
      >
        <IconsDocument class="size-3" />
        {{ t('landing.features.panels.contract.badge') }} №1324565345
      </span>
      <span
        class="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-md bg-black/55 px-2 py-1 text-[10px] text-white backdrop-blur"
      >
        <span class="flex items-center gap-1"><Icon
          name="lucide:scan"
          class="size-3"
        />185m²</span>
        <span class="flex items-center gap-1"><Icon
          name="lucide:layers"
          class="size-3"
        />12/12</span>
      </span>
    </div>

    <!-- Body -->
    <div class="p-4">
      <p class="font-semibold text-neutral-900">
        Mirabad Square | Penthouse
      </p>
      <p class="mt-1 flex items-center gap-1 text-xs text-neutral-500">
        <IconsMapPin class="size-3.5 shrink-0" />Toshkent, Mirobod t. Mirobod Avenue, D, 34
      </p>

      <div class="mt-2 flex items-center justify-between">
        <p class="font-bold text-neutral-900">
          24,5 mln so'm
          <span class="text-xs font-normal text-neutral-400">/ {{ t('landing.listings.perMonth') }}</span>
        </p>
        <span class="text-xs text-neutral-400">{{ paid }}/{{ total }} oy</span>
      </div>

      <!-- Payment progress -->
      <div class="mt-3 flex gap-1">
        <span
          v-for="i in total"
          :key="i"
          class="h-1.5 flex-1 rounded-full"
          :class="i <= paid ? 'bg-success-500' : 'bg-neutral-200'"
        />
      </div>

      <!-- Tenant -->
      <div class="mt-3">
        <p class="text-xs text-neutral-400">
          {{ t('landing.features.panels.contract.tenant') }}
        </p>
        <div class="mt-1 flex items-center gap-2">
          <img
            src="/landing/avatar-tenant.png"
            alt="Abdullayev Sarvar"
            class="size-6 rounded-full bg-neutral-200 object-cover"
            onerror="this.style.visibility='hidden'"
          >
          <span class="text-sm font-medium text-neutral-900">Abdullayev Sarvar</span>
        </div>
      </div>

      <!-- Dates -->
      <dl class="mt-3 space-y-1.5 border-t border-neutral-100 pt-3 text-xs">
        <div class="flex justify-between">
          <dt class="text-neutral-400">
            {{ t('landing.features.panels.contract.contractDate') }}
          </dt>
          <dd class="font-medium text-neutral-900">
            2-Avgust, 2025
          </dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-neutral-400">
            {{ t('landing.features.panels.contract.nextPayment') }}
          </dt>
          <dd class="font-medium text-neutral-900">
            3-Aprel, 2025
          </dd>
        </div>
      </dl>

      <!-- Signed footer -->
      <div
        class="mt-3 flex items-center gap-2 rounded-xl bg-success-50 px-3 py-2 text-xs font-medium text-success-700"
      >
        <span class="inline-flex size-5 items-center justify-center rounded-full bg-success-600 text-white">
          <Icon
            name="lucide:check"
            class="size-3.5"
          />
        </span>
        {{ t('landing.features.panels.contract.signed') }}
      </div>
    </div>
  </div>
</template>
