<template>
  <div class="booking-page">

    <h2>Select a Date and Time</h2>

    <CalendarGrid @date-selected="handleDateSelected" />

    <!-- <div class="calendar-section">
      <button @click="fetchTimeSlots">fetch slots</button>
    </div> -->

    <div class="time-slot-container">
      <button
        v-for="slot in store.slots[store.selectedDate]"
        :key="slot.time"
        class="time-slot"
        @click="openConfirmModal(slot)"
      >
        {{ formatSlotTime(slot.time) }}
      </button>
    </div>

    <ConfirmModal
      :is-open="showConfirmModal"
      :date="store.selectedDate"
      :time="selectedTimeSlot ? selectedTimeSlot.time : ''"
      :location="selectedBranch ? selectedBranch.name : ''"
      @close="closeConfirmModal"
      @confirm="confirmTimeSlot"
    />

    <!-- <TimeSlots :slots="store.slots" /> -->
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../store.js'
import { calApi } from '../services/calApi'
import CalendarGrid from '../components/CalendarGrid.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
// import TimeSlots from '../components/TimeSlots.vue'


export default {
  name: 'BookingPage',
  components: {
    CalendarGrid,
    ConfirmModal
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const selectedDate = ref('2025-04-07')
    const selectedTimeSlot = ref(null)
    const timeSlots = ref([])
    const loading = ref(false)
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
      // Handle the selected date, e.g., fetch available time slots
      selectedDate.value = date
      console.log('Selected date:', date)
    }

    const fetchTimeSlots = async () => {
      // if (!selectedDate.value) return

      loading.value = true
      error.value = ''
      timeSlots.value = []

      try {
        const slots = await calApi.getSlots('2025-04-07')
        store.setSlots(slots)
        timeSlots.value = slots
      } catch (err) {
        error.value = 'Failed to load available time slots. Please try again.'
        console.error('Error fetching slots:', err)
      } finally {
        loading.value = false
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
      closeConfirmModal()
    }

    const submitBooking = async () => {
      if (!selectedTimeSlot.value) return

      submitting.value = true
      try {
        const bookingData = {
          startTime: selectedTimeSlot.value.time,
          // name: formData.name,
          // email: formData.email
          name: 'Andrew Beales',
          email: 'andrewbeales@gmail.com',
          location: `Cubitts ${store.selectedBranch.name}, ${store.selectedBranch.location}`
        }

        const booking = await calApi.createBooking(bookingData)
        
        console.log("RESPONSE")
        console.log(booking)

        // Store booking details in localStorage for the confirmation page
        localStorage.setItem('cubittsLastBooking', JSON.stringify({
          date: selectedDate.value.time,
          time: selectedTimeSlot.value.time,
          name: 'Andrew Beales',
          email: 'andrewbeales@gmail.com',
          // name: formData.name,
          // email: formData.email,
          location: `Cubitts ${store.selectedBranch.name}, ${store.selectedBranch.location}`
        }))

        router.push('/confirmation')
      } catch (err) {
        error.value = 'Failed to create booking. Please try again.'
        console.error('Error creating booking:', err)
      } finally {
        submitting.value = false
      }
    }

    onMounted(async () => {
      await fetchTimeSlots()

      // Get the selected branch from localStorage
      const storedBranch = localStorage.getItem('selectedBranch')
      if (storedBranch) {
        selectedBranch.value = JSON.parse(storedBranch)
      }
    })

    return {
      store,
      formatSlotTime,
      selectedDate,
      selectedTimeSlot,
      timeSlots,
      loading,
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