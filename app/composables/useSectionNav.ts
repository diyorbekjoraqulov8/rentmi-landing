/**
 * Smooth in-page navigation to landing sections.
 *
 * The drawer/logo live on every page, but the sections (#about, #features…)
 * only exist on the landing page. These helpers make a click always land on
 * the right spot: if we're already on the home page we just smooth-scroll;
 * otherwise we navigate home first, wait for the target to mount, then scroll.
 */
export function useSectionNav() {
  const route = useRoute()
  const router = useRouter()
  const localePath = useLocalePath()

  const homePath = computed(() => localePath('/'))

  /** Navigate to the landing page if we aren't already there. */
  async function ensureHome() {
    if (route.path === homePath.value) return
    // Push without the hash so Nuxt's default scrollBehavior doesn't do an
    // instant jump that would fight our smooth scroll below.
    await router.push(homePath.value)
    await nextTick()
  }

  /** Poll briefly for an element that may still be mounting after navigation. */
  function waitForEl(selector: string, tries = 20): Promise<Element | null> {
    return new Promise((resolve) => {
      let n = 0
      const tick = () => {
        const el = document.querySelector(selector)
        if (el || n++ >= tries) return resolve(el)
        window.setTimeout(tick, 50)
      }
      tick()
    })
  }

  /** Smooth-scroll to a section anchor (e.g. `#about`) from anywhere. */
  async function goToSection(href: string) {
    await ensureHome()
    const el = await waitForEl(href)
    // Small delay so the drawer can finish closing / body scroll unlocks.
    window.setTimeout(() => {
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }

  /** Smooth-scroll back to the top (hero) of the landing page from anywhere. */
  async function goHome() {
    await ensureHome()
    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 60)
  }

  return { homePath, goToSection, goHome }
}
