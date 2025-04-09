import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import StoreSelectionPage from '../StoreSelectionPage.vue'
import { useStore } from '../../store'

// Mock the router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

// Mock the store API
vi.mock('../../services/storeApi', () => ({
  storeApi: {
    getStores: vi.fn().mockResolvedValue([
      { id: 1, name: 'Store 1' },
      { id: 2, name: 'Store 2' }
    ])
  }
}))

describe('StoreSelectionPage', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    setActivePinia(createPinia())
    
    // Reset all mocks
    vi.clearAllMocks()
  })

  it('renders the component', () => {
    const wrapper = mount(StoreSelectionPage)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('Select a Store')
  })

  it('loads stores on mount', async () => {
    const wrapper = mount(StoreSelectionPage)
    const store = useStore()
    
    // Wait for the component to update
    await wrapper.vm.$nextTick()
    
    expect(store.stores).toEqual([
      { id: 1, name: 'Belgravia' },
      { id: 2, name: 'Store 2' }
    ])
  })

  it('selects a store and navigates to booking page', async () => {
    const wrapper = mount(StoreSelectionPage)
    const store = useStore()
    
    // Wait for the component to update
    await wrapper.vm.$nextTick()
    
    // Find and click the first store button
    const storeButton = wrapper.findAll('button').find(button => button.text().includes('Belgravia'))
    await storeButton.trigger('click')
    
    // Check if the store was selected
    expect(store.selectedBranch).toEqual({ id: 1, name: 'Belgravia' })
    
    // Check if the router was pushed to the booking page
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/booking')
  })
}) 