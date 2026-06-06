/**
 * Scroll-spy: tracks which of the given section ids is currently in view so the
 * nav drawer can highlight the matching menu item.
 *
 * Uses an IntersectionObserver with a thin trigger band near the top of the
 * viewport; the deepest section crossing that band wins. The observed elements
 * only exist on the landing page — elsewhere the active id stays empty (route
 * matching handles real pages like /team).
 */
export function useActiveSection(ids: string[]) {
  const active = ref('')
  const visible = new Set<string>()
  let observer: IntersectionObserver | null = null

  function recompute() {
    // Walk ids in DOM order; the last one crossing the band is the active one.
    for (let i = ids.length - 1; i >= 0; i--) {
      const id = ids[i]
      if (id && visible.has(id)) {
        active.value = id
        return
      }
    }
    active.value = ''
  }

  function start() {
    if (!import.meta.client) return
    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) visible.add(e.target.id)
            else visible.delete(e.target.id)
          }
          recompute()
        },
        { rootMargin: '-20% 0px -75% 0px', threshold: 0 }
      )
    }
    // Re-bind to the current DOM (sections only exist on the landing page).
    observer.disconnect()
    visible.clear()
    recompute()
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
  }

  // The drawer/header stay mounted across SPA navigation, so re-scan whenever
  // the route changes — sections that were absent on /team appear on home.
  const route = useRoute()
  watch(() => route.path, () => nextTick(start))
  onMounted(start)
  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
    visible.clear()
  })

  return active
}
