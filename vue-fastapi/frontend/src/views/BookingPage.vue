<template>
  <div class="booking-page">

    <h2>Select a Date and Time</h2>

    <CalendarGrid @date-selected="handleDateSelected" />

    <div v-if="showTimeSlots">
      <div v-if="loadingTimeSlots" class="loading-container">
        <div class="spinner"></div>
        <p>Loading available time slots...</p>
      </div>
      <div v-else>
        <TimeSlotContainer
          :slots="store.slots[store.selectedDate] || []"
          @select-slot="openConfirmModal"
        />
      </div>
    </div>

    <ConfirmModal
      :is-open="showConfirmModal"
      :date="store.selectedDate"
      :time="selectedTimeSlot ? selectedTimeSlot.time : ''"
      :location="store.selectedBranch ? store.selectedBranch.name : ''"
      :form-data="formData"
      :submitting="submitting"
      @close="closeConfirmModal"
      @confirm="confirmTimeSlot"
    />

  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../store.js'
import { calApi } from '../services/calApi'
import { formatDateToYYYYMMDD, getStartOfWeek } from '../utils.js'
import CalendarGrid from '../components/CalendarGrid.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import TimeSlotContainer from '../components/TimeSlotContainer.vue'


export default {
  name: 'BookingPage',
  components: {
    CalendarGrid,
    ConfirmModal,
    TimeSlotContainer
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const selectedDate = ref('2025-04-07')
    const selectedTimeSlot = ref(null)
    const loadingTimeSlots = ref(false)
    const showTimeSlots = ref(false)
    const error = ref('')
    const submitting = ref(false)
    const showConfirmModal = ref(false)
    const selectedBranch = ref(null)
    const formData = reactive({
      name: '',
      email: ''
    })

    const formatSlotTime = (dateString) => {
      return new Date(dateString).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
      })
    }

    const minDate = computed(() => {
      const today = new Date()
      return today.toISOString().split('T')[0]
    })

    const handleDateSelected = (date) => {

      // Fetch available time slots
      selectedDate.value = date
      const fetchedDates = Object.keys(store.slots)

      // If selected date not already fetched, fetch that week's slots
      if (!fetchedDates.includes(formatDateToYYYYMMDD(date))) {
        const fetchDate = getStartOfWeek(date)
        fetchTimeSlots(fetchDate)
      }
    }

    const fetchTimeSlots = async (date) => {

      loadingTimeSlots.value = true
      error.value = ''

      try {

        const slots = await calApi.getSlots(store.selectedBranch.name, date)
        store.setSlots({...store.slots, ...slots})
        showTimeSlots.value = true
      } catch (err) {
        error.value = 'Failed to load available time slots. Please try again.'
        console.error('Error fetching slots:', err)
      } finally {
        loadingTimeSlots.value = false
      }
    }

    const openConfirmModal = (slot) => {
      selectedTimeSlot.value = slot
      showConfirmModal.value = true
    }

    const closeConfirmModal = () => {
      showConfirmModal.value = false
    }

    const confirmTimeSlot = () => {
      submitBooking()
    }

    const submitBooking = async () => {
      if (!selectedTimeSlot.value) return

      submitting.value = true
      try {
        const bookingData = {
          startTime: selectedTimeSlot.value.time,
          name: formData.name,
          email: formData.email,
          storeName: store.selectedBranch.name
        }

        await calApi.createBooking(bookingData)

        store.setBookingDetails({
          date: selectedTimeSlot.value.time,
          name: formData.name,
          email: formData.email,
          branch: store.selectedBranch
        })

        closeConfirmModal()
        router.push('/confirmation')

      } catch (err) {
        error.value = 'Failed to create booking. Please try again.'
        console.error('Error creating booking:', err)
      } finally {
        submitting.value = false
      }
    }

    onMounted(async () => {
      const today = new Date()
      await fetchTimeSlots(today)

    })

    return {
      store,
      formatSlotTime,
      selectedDate,
      selectedTimeSlot,
      loadingTimeSlots,
      showTimeSlots,
      error,
      submitting,
      formData,
      minDate,
      fetchTimeSlots,
      openConfirmModal,
      closeConfirmModal,
      confirmTimeSlot,
      submitBooking,
      handleDateSelected,
      showConfirmModal,
      selectedBranch
    }
  }
}
</script>

<style scoped>

.booking-page {
  display: flex;
  flex-direction: column;
}

.calendar-section {
  padding: 1rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #333;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.time-slot-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.1rem;
  margin-top: 1.5rem;
}

.time-slot {
  background-color: #f0f0f0;
  border: none;
  width: 6rem;
  height: 3rem;
  padding: 0.5rem;
  margin: 0.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  color: #333;
  transition: background-color 0.1s ease;
}

.time-slot:hover {
  background-color: #e0e0e0;
}
</style> 