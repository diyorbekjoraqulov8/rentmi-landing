<script setup lang="ts">
const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { goToSection } = useSectionNav()

// `to` → real route (NuxtLink); `href` → in-page anchor on the landing page.
const nav = [
  { key: 'header.nav.about', href: '#about' },
  { key: 'header.drawer.team', to: '/team' },
  { key: 'landing.features.title', href: '#features' },
  { key: 'header.drawer.testimonials', href: '#testimonials' }
]

const legal = [
  { key: 'header.drawer.offer', to: '/terms' },
  { key: 'footer.useful.privacy', to: '/privacy' }
]

// Scroll-spy over the landing sections so the open drawer highlights the
// section currently in view. Empty (no highlight) on real pages like /team.
const activeSection = useActiveSection(['about', 'features', 'testimonials'])

// Compare paths ignoring trailing slashes (routes may be normalised to `/x/`).
const norm = (p: string) => p.replace(/\/+$/, '') || '/'
const onHome = computed(() => norm(route.path) === norm(localePath('/')))

function isActive(item: { to?: string, href?: string }) {
  if (item.to) return norm(route.path) === norm(localePath(item.to))
  return onHome.value && item.href === `#${activeSection.value}`
}

function close() {
  open.value = false
}

function go(href?: string) {
  if (!href) return
  close()
  // Navigates home first when on another page, then smooth-scrolls.
  goToSection(href)
}

// Lock body scroll while the drawer is open.
watch(open, (isOpen) => {
  if (import.meta.client) {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-to-class="opacity-0">
      <div
        v-if="open"
        class="fixed inset-0 z-[60] bg-neutral-900/20 backdrop-blur-md"
        @click="close" />
    </Transition>

    <!-- Panel -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="-translate-x-full"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-to-class="-translate-x-full">
      <aside
        v-if="open"
        class="fixed inset-y-3 left-3 z-[70] flex w-[calc(100%-1.5rem)] max-w-[560px] flex-col overflow-y-auto rounded-3xl bg-surface px-8 py-6 shadow-2xl sm:inset-y-4 sm:left-4 sm:px-12"
        role="dialog"
        aria-modal="true">
        <!-- Close (MENU ✕) -->
        <div class="flex justify-end">
          <button
            type="button"
            class="inline-flex items-center gap-3 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-100"
            @click="close">
            {{ t('header.menu') }}
            <IconsClose class="size-5" />
          </button>
        </div>

        <!-- Nav -->
        <nav class="mt-10 flex flex-col gap-7">
          <template v-for="item in nav" :key="item.key">
            <NuxtLink
              v-if="item.to"
              :to="localePath(item.to)"
              class="w-fit text-2xl font-medium text-neutral-900 transition-colors"
              :class="isActive(item)
                ? 'rounded-full border border-neutral-300 px-6 py-3'
                : 'px-2 hover:text-brand-600'"
              :aria-current="isActive(item) ? 'page' : undefined"
              @click="close">
              {{ t(item.key) }}
            </NuxtLink>
            <a
              v-else
              :href="item.href"
              class="w-fit text-2xl font-medium text-neutral-900 transition-colors"
              :class="isActive(item)
                ? 'rounded-full border border-neutral-300 px-6 py-3'
                : 'px-2 hover:text-brand-600'"
              :aria-current="isActive(item) ? 'true' : undefined"
              @click.prevent="go(item.href)">
              {{ t(item.key) }}
            </a>
          </template>
        </nav>

        <!-- App download block (bottom) -->
        <div class="mt-auto pt-12">
          <h3 class="text-2xl font-bold text-neutral-900">
            {{ t('landing.download.title') }}
          </h3>
          <p class="mt-2 text-sm text-neutral-500">
            {{ t('landing.download.desc') }}
          </p>

          <div class="mt-5 flex flex-wrap gap-3">
            <SharedAppStoreBadge />
            <SharedGooglePlayBadge />
          </div>

          <!-- Language -->
          <div class="mt-8">
            <LangSwitcher />
          </div>

          <!-- Legal -->
          <div
            class="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-neutral-500">
            <NuxtLink
              v-for="link in legal"
              :key="link.to"
              :to="localePath(link.to)"
              class="transition-colors hover:text-brand-600"
              @click="close">
              {{ t(link.key) }}
            </NuxtLink>
          </div>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>
