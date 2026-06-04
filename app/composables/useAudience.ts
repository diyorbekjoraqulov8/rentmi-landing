import type { Audience } from '~/data/landing'

/**
 * Shared "Uy egalari uchun / Ijarachilar uchun" audience toggle.
 *
 * The header and hero both expose the same tab, so the selection lives in a
 * single `useState` keyed instance — switching it in one place updates the
 * whole page. Defaults to the tenant view (matches the design's default tab).
 */
export const useAudience = () => {
  const audience = useState<Audience>('landing-audience', () => 'tenant')

  const setAudience = (next: Audience) => {
    audience.value = next
  }

  const isOwner = computed(() => audience.value === 'owner')

  return { audience, setAudience, isOwner }
}
