<script setup lang="ts">
/**
 * Icon adapter for data-driven icon names (arrays/config in data/landing.ts).
 *
 * Two sources behind one `:name` string:
 *   - `lucide:*`     → rendered via <Icon> (@nuxt/icon)
 *   - `Icons*` name  → our own SVG set under components/icons/*
 *
 * The local icons are imported explicitly into `registry` below: a raw
 * `<component :is="'IconsX'">` can't resolve an auto-imported component, so the
 * components must be referenced statically somewhere — here. When a new local
 * icon is used from data, add it to the registry.
 *
 * In static markup, reference the `<IconsX />` component directly instead.
 */
import IconsScoringFlame from '~/components/icons/ScoringFlame.vue'
import IconsDocument from '~/components/icons/Document.vue'
import IconsShareLarge from '~/components/icons/ShareLarge.vue'
import IconsEye from '~/components/icons/Eye.vue'
import IconsBookmark from '~/components/icons/Bookmark.vue'
import IconsFileExport from '~/components/icons/FileExport.vue'

const registry: Record<string, Component> = {
  IconsScoringFlame,
  IconsDocument,
  IconsShareLarge,
  IconsEye,
  IconsBookmark,
  IconsFileExport
}

const props = defineProps<{ name: string }>()

const isLucide = computed(() => props.name.startsWith('lucide:'))
const local = computed(() => registry[props.name] ?? null)
</script>

<template>
  <Icon
    v-if="isLucide"
    :name="name"
  />
  <component
    :is="local"
    v-else-if="local"
  />
</template>
