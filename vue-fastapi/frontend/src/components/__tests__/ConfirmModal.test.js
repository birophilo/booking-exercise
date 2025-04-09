import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ConfirmModal from '../ConfirmModal.vue'
import { useBookingStore } from '../../stores/booking'

describe('ConfirmModal', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    setActivePinia(createPinia())
    
    // Reset all mocks
    vi.clearAllMocks()
  })

  it('renders the component with the correct props', () => {
    const store = useBookingStore()
    store.selectedTimeSlot = { time: '2025-04-07T10:00:00Z' }
    store.formData = {
      name: 'Test User',
      email: 'test@example.com'
    }
    
    const wrapper = mount(ConfirmModal, {
      props: {
        show: true
      }
    })
    
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h3').text()).toContain('Confirm Booking')
    expect(wrapper.find('p').text()).toContain('Test User')
    expect(wrapper.find('p').text()).toContain('test@example.com')
    expect(wrapper.find('p').text()).toContain('2025-04-07T10:00:00Z')
  })

  it('emits the close event when the cancel button is clicked', async () => {
    const wrapper = mount(ConfirmModal, {
      props: {
        show: true
      }
    })
    
    await wrapper.find('button.cancel-button').trigger('click')
    
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits the confirm event when the confirm button is clicked', async () => {
    const wrapper = mount(ConfirmModal, {
      props: {
        show: true
      }
    })
    
    await wrapper.find('button.confirm-button').trigger('click')
    
    expect(wrapper.emitted('confirm')).toBeTruthy()
  })

  it('does not render when show prop is false', () => {
    const wrapper = mount(ConfirmModal, {
      props: {
        show: false
      }
    })
    
    expect(wrapper.find('.modal').exists()).toBe(false)
  })
}) 