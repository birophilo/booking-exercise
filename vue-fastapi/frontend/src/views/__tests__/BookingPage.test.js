import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import BookingPage from '../BookingPage.vue'
import CalendarGrid from '../../components/CalendarGrid.vue'
import TimeSlotContainer from '../../components/TimeSlotContainer.vue'
import ConfirmModal from '../../components/ConfirmModal.vue'
import { useStore } from '../../store'
import { calApi } from '../../services/calendar'
import { formatDate, getWeekDates } from '../../utils/dateUtils'

// Mock the calendar API
vi.mock('../../services/calendar', () => ({
  calApi: {
    getSlots: vi.fn(),
    createBooking: vi.fn()
  }
}))

// Mock the date utils
vi.mock('../../utils/dateUtils', () => ({
  formatDate: vi.fn(),
  getWeekDates: vi.fn()
}))

describe('BookingPage', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    setActivePinia(createPinia())
    
    // Reset all mocks
    vi.clearAllMocks()
    
    // Mock implementation for date utils
    formatDate.mockImplementation(date => date.toISOString().split('T')[0])
    getWeekDates.mockImplementation(() => [
      new Date('2025-04-07'),
      new Date('2025-04-08'),
      new Date('2025-04-09'),
      new Date('2025-04-10'),
      new Date('2025-04-11'),
      new Date('2025-04-12'),
      new Date('2025-04-13')
    ])
  })

  it('renders the component', () => {
    const wrapper = mount(BookingPage)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('Book an Appointment')
  })

  it('renders the calendar grid', () => {
    const wrapper = mount(BookingPage)
    expect(wrapper.findComponent(CalendarGrid).exists()).toBe(true)
  })

  it('fetches time slots when a date is selected', async () => {
    const mockSlots = [
      { time: '2025-04-07T10:00:00Z' },
      { time: '2025-04-07T11:00:00Z' }
    ]
    
    calApi.getSlots.mockResolvedValue(mockSlots)
    
    const wrapper = mount(BookingPage)
    const store = useStore()
    
    await wrapper.findComponent(CalendarGrid).vm.$emit('date-selected', new Date('2025-04-07'))
    
    expect(store.selectedDate).toEqual(new Date('2025-04-07'))
    expect(calApi.getSlots).toHaveBeenCalledWith('2025-04-07')
    expect(store.slots).toEqual(mockSlots)
  })

  it('opens confirmation modal when a time slot is selected', async () => {
    const wrapper = mount(BookingPage)
    const store = useStore()
    
    await wrapper.findComponent(TimeSlotContainer).vm.$emit('slot-selected', { time: '2025-04-07T10:00:00Z' })
    
    expect(store.selectedTimeSlot).toEqual({ time: '2025-04-07T10:00:00Z' })
    expect(wrapper.findComponent(ConfirmModal).props('show')).toBe(true)
  })

  it('submits booking and navigates to confirmation page', async () => {
    const mockBooking = {
      id: '123',
      time: '2025-04-07T10:00:00Z',
      name: 'Test User',
      email: 'test@example.com'
    }
    
    calApi.createBooking.mockResolvedValue(mockBooking)
    
    const wrapper = mount(BookingPage)
    const store = useStore()
    
    await wrapper.findComponent(ConfirmModal).vm.$emit('confirm', {
      name: 'Test User',
      email: 'test@example.com'
    })
    
    expect(calApi.createBooking).toHaveBeenCalledWith({
      time: store.selectedTimeSlot.time,
      name: 'Test User',
      email: 'test@example.com'
    })
    expect(store.bookingDetails).toEqual(mockBooking)
    expect(wrapper.findComponent(ConfirmModal).props('show')).toBe(false)
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/confirmation')
  })
}) 