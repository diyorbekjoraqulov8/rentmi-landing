<script setup lang="ts">
/**
 * Left slide-in navigation drawer (opened from the header MENU button).
 *
 * Teleported to <body> so it overlays the whole page: a blurred/dimmed
 * backdrop behind, the white panel sliding in from the left with a transform
 * transition. Holds the section nav, the app-download block, language switcher
 * and legal links — mirroring the Figma site menu.
 *
 * Closes on backdrop click, the MENU ✕ button, Escape, or picking a link
 * (which then smooth-scrolls to the section). Locks body scroll while open.
 */
const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n()
const localePath = useLocalePath()

const nav = [
  { key: 'header.nav.about', href: '#about' },
  { key: 'header.drawer.team', href: '#team' },
  { key: 'landing.features.title', href: '#features' },
  { key: 'header.drawer.testimonials', href: '#testimonials' }
]

const stores = [
  { icon: 'lucide:apple', top: 'landing.download.onThe', bottom: 'landing.download.appStore' },
  { icon: 'lucide:play', top: 'landing.download.getItOn', bottom: 'landing.download.googlePlay' }
]

const legal = [
  { key: 'header.drawer.offer', to: '/terms' },
  { key: 'footer.useful.privacy', to: '/privacy' }
]

function close() {
  open.value = false
}

function go(href: string) {
  close()
  // Wait for the drawer to close / body scroll to unlock, then scroll.
  nextTick(() => {
    window.setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  })
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
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-40 bg-neutral-900/20 backdrop-blur-md"
        @click="close"
      />
    </Transition>

    <!-- Panel -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="-translate-x-full"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-to-class="-translate-x-full"
    >
      <aside
        v-if="open"
        class="fixed inset-y-0 left-0 z-50 flex w-full max-w-[590px] flex-col overflow-y-auto bg-surface px-8 py-6 shadow-2xl sm:px-12"
        role="dialog"
        aria-modal="true"
      >
        <!-- Close (MENU ✕) -->
        <div class="flex justify-end">
          <button
            type="button"
            class="inline-flex items-center gap-3 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-100"
            @click="close"
          >
            {{ t('header.menu') }}
            <IconsClose class="size-5" />
          </button>
        </div>

        <!-- Nav -->
        <nav class="mt-10 flex flex-col gap-7">
          <a
            v-for="item in nav"
            :key="item.href"
            :href="item.href"
            class="w-fit text-2xl font-bold text-neutral-900 transition-colors hover:text-brand-600"
            @click.prevent="go(item.href)"
          >
            {{ t(item.key) }}
          </a>
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
            <a
              v-for="store in stores"
              :key="store.bottom"
              href="#"
              class="inline-flex items-center gap-3 rounded-xl bg-black px-5 py-2.5 text-white transition-colors hover:bg-neutral-900"
            >
              <Icon
                :name="store.icon"
                class="size-7"
              />
              <span class="text-left leading-tight">
                <span class="block text-[10px] text-white/70">{{ t(store.top) }}</span>
                <span class="block text-base font-semibold">{{ t(store.bottom) }}</span>
              </span>
            </a>
          </div>

          <!-- Language -->
          <div class="mt-8">
            <LangSwitcher />
          </div>

          <!-- Legal -->
          <div class="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-neutral-500">
            <NuxtLink
              v-for="link in legal"
              :key="link.to"
              :to="localePath(link.to)"
              class="transition-colors hover:text-brand-600"
              @click="close"
            >
              {{ t(link.key) }}
            </NuxtLink>
          </div>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>
