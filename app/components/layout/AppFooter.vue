<script setup lang="ts">
/**
 * Site footer matching the Figma design:
 *  row 1 — brand + copyright | "Huquqiy masalalar" | "Biz bilan aloqa" | socials
 *  row 2 — divider, then "To'lov usullari" with payment-provider badges.
 * Link columns are data-driven.
 */
const { t } = useI18n()
const localePath = useLocalePath()

const legal = [
  { labelKey: 'footer.useful.terms', to: '/terms' },
  { labelKey: 'footer.useful.privacy', to: '/privacy' },
  { labelKey: 'footer.useful.payment', to: '/payment-refund' }
]

const socials = [
  { icon: 'IconsTelegram', label: 'rentmi_uz', href: 'https://t.me/rentmi_uz' },
  {
    icon: 'IconsInstagram',
    label: 'rentmi.uz',
    href: 'https://instagram.com/rentmi.uz'
  },
  {
    icon: 'IconsFacebook',
    label: 'rentmi uz',
    href: 'https://facebook.com/rentmi.uz'
  }
]

// Payment providers — text badges for now; swap for logos in public/landing/.
const payments = ['Uzum', 'Click', 'Payme', 'Atmos']

const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-surface border-t border-neutral-200">
    <div class="container px-4 sm:px-6 py-14">
      <div class="grid gap-10 md:grid-cols-4">
        <!-- Brand + copyright -->
        <div class="space-y-4">
          <NuxtLink
            :to="localePath('/')"
            class="flex items-center gap-2 text-2xl font-extrabold text-brand-600">
            <IconsLocationPin class="size-7" />
            Rentmi
          </NuxtLink>
          <p class="text-sm leading-relaxed text-neutral-500">
            © Rentmi {{ year }}<br />
            {{ t('footer.rights') }}
          </p>
        </div>

        <!-- Legal links -->
        <div class="space-y-4">
          <h3 class="font-semibold text-neutral-900">
            {{ t('footer.legal') }}
          </h3>
          <ul class="space-y-3">
            <li v-for="link in legal" :key="link.to">
              <NuxtLink
                :to="localePath(link.to)"
                class="text-sm text-neutral-500 hover:text-brand-600 transition-colors">
                {{ t(link.labelKey) }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="space-y-4">
          <h3 class="font-semibold text-neutral-900">
            {{ t('footer.contact.title') }}
          </h3>
          <ul class="space-y-3 text-sm">
            <li>
              <a
                href="mailto:info@rentmi.uz"
                class="text-neutral-500 hover:text-brand-600"
                >info@rentmi.uz</a
              >
            </li>
            <li>
              <a
                href="tel:+998781138878"
                class="text-neutral-500 hover:text-brand-600"
                >+998 78 113 88 78</a
              >
            </li>
          </ul>
        </div>

        <!-- Socials -->
        <div class="space-y-4">
          <h3 class="font-semibold text-neutral-900">
            {{ t('footer.social.title') }}
          </h3>
          <ul class="space-y-3">
            <li v-for="s in socials" :key="s.label">
              <a
                :href="s.href"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-brand-600 transition-colors">
                <component :is="s.icon" class="size-4 text-brand-600" />
                {{ s.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Divider + payments -->
      <div class="mt-12 border-t border-neutral-200 pt-8">
        <div class="flex flex-wrap items-center gap-6">
          <span class="font-semibold text-neutral-900">{{
            t('footer.payments')
          }}</span>
          <div class="flex flex-wrap items-center gap-5">
            <span
              v-for="p in payments"
              :key="p"
              class="text-sm font-semibold text-neutral-400"
              >{{ p }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
