// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import IndexPage from '../pages/index.vue'

describe('index page', () => {
  it('renders the hero heading', async () => {
    const wrapper = await mountSuspended(IndexPage)
    expect(wrapper.find('h1').exists()).toBe(true)
  })
})
