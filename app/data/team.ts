/**
 * Static team roster for the "Bizning jamoa" (/team) page.
 * Names are proper nouns kept as-is across locales; only roles are i18n keys
 * (resolved via t(roleKey) in the components). Photos live in /public/team/.
 */
export interface TeamMember {
  name: string
  roleKey: string
  image: string
}

export const founder: TeamMember = {
  name: 'Abrorxo‘ja Turdaliyev',
  roleKey: 'team.roles.founder',
  image: '/team/founder.webp'
}

export const advisors: TeamMember[] = [
  { name: 'Shokhpur Gulturaev', roleKey: 'team.roles.cto', image: '/team/cto.webp' },
  { name: 'Laylo Xondamirovna', roleKey: 'team.roles.cmo', image: '/team/cmo.webp' }
]

export const management: TeamMember[] = [
  { name: 'Abdulloh Shokirov', roleKey: 'team.roles.manager', image: '/team/manager.webp' }
]

export const developers: TeamMember[] = [
  { name: 'Aziza Azimova', roleKey: 'team.roles.backend', image: '/team/backend.webp' },
  { name: 'Doston Abdullayev', roleKey: 'team.roles.frontend', image: '/team/frontend.webp' },
  { name: 'Sherzod Valiyev', roleKey: 'team.roles.solution', image: '/team/solution-architecture.webp' },
  { name: 'Alibek Madaminov', roleKey: 'team.roles.devops', image: '/team/devops.webp' },
  { name: 'Malika Rahimova', roleKey: 'team.roles.smm', image: '/team/smm-manager.webp' },
  { name: 'Murod Talipov', roleKey: 'team.roles.product', image: '/team/product-disign.webp' }
]

/** Flat list — handy for schema.org Person markup. */
export const allMembers: TeamMember[] = [founder, ...advisors, ...management, ...developers]
