import type { Ref } from 'vue'

/**
 * Registry connecting the single traveling audience pill
 * (LandingFloatingAudienceTabs) to its per-section anchors
 * (LandingAudiencePillAnchor).
 *
 * Sections drop an invisible, exact-size anchor where the pill should rest;
 * the pill picks the "active" anchor from the scroll position and springs to
 * it. The registry is deliberately not reactive — the pill reads it inside a
 * rAF loop and only needs a wake signal when the set changes.
 */

/**
 * Structural element types (instead of HTMLElement) because template refs in
 * this repo type as happy-dom's HTMLElement (vitest types leak into vue-tsc),
 * which is incompatible with lib.dom's.
 */
export interface PillAnchorTarget {
  getBoundingClientRect: () => {
    top: number
    left: number
    width: number
    height: number
  }
}

interface AnchorEntry {
  el: PillAnchorTarget
  order: number
}

const anchors: AnchorEntry[] = []
let notify: (() => void) | null = null

/** Consumed by the pill: ordered anchor list + change subscription. */
export function usePillAnchorRegistry() {
  return {
    /** sorted by `order`; entries whose rect has zero width are hidden */
    list: () => anchors as readonly AnchorEntry[],
    subscribe(cb: () => void) {
      notify = cb
    },
    unsubscribe() {
      notify = null
    }
  }
}

/** Used by each anchor component: register for the element's lifetime. */
export function useAudiencePillAnchor(
  el: Ref<PillAnchorTarget | null>,
  order: number
) {
  let entry: AnchorEntry | null = null

  onMounted(() => {
    if (!el.value) return
    entry = { el: el.value, order }
    anchors.push(entry)
    anchors.sort((a, b) => a.order - b.order)
    notify?.()
  })

  onBeforeUnmount(() => {
    if (!entry) return
    const i = anchors.indexOf(entry)
    if (i >= 0) anchors.splice(i, 1)
    entry = null
    notify?.()
  })
}
