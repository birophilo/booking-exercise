<template>
  <div class="booking-page">

    <CalendarGrid @date-selected="handleDateSelected" />

    <div class="calendar-section">
      <h2>Select a Date and Time</h2>
      <button @click="fetchTimeSlots">fetch slots</button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { calApi } from '../services/calApi'
import CalendarGrid from '../components/CalendarGrid.vue'



export default {
  name: 'BookingPage',
  components: {
    CalendarGrid
  },
  setup() {
    const router = useRouter()
    const selectedDate = ref('')
    const selectedTimeSlot = ref(null)
    const timeSlots = ref([])
    const loading = ref(false)
    const error = ref('')
    const submitting = ref(false)
    const formData = reactive({
      name: '',
      email: ''
    })

    const minDate = computed(() => {
      const today = new Date()
      return today.toISOString().split('T')[0]
    })

    const handleDateSelected = (date) => {
      // Handle the selected date, e.g., fetch available time slots
      console.log('Selected date:', date)
    }

    const fetchTimeSlots = async () => {
      // if (!selectedDate.value) return

      loading.value = true
      error.value = ''
      timeSlots.value = []

      try {
        const slots = await calApi.getSlots('2025-04-07')
        console.log(slots)
        timeSlots.value = slots
      } catch (err) {
        error.value = 'Failed to load available time slots. Please try again.'
        console.error('Error fetching slots:', err)
      } finally {
        loading.value = false
      }
    }

    const selectTimeSlot = (slot) => {
      selectedTimeSlot.value = slot
    }

    const submitBooking = async () => {
      if (!selectedTimeSlot.value) return

      submitting.value = true
      try {
        const bookingData = {
          startTime: selectedTimeSlot.value.startTime,
          endTime: selectedTimeSlot.value.endTime,
          name: formData.name,
          email: formData.email
        }

        const booking = await calApi.createBooking(bookingData)
        
        // Store booking details in localStorage for the confirmation page
        localStorage.setItem('lastBooking', JSON.stringify({
          date: selectedDate.value,
          time: selectedTimeSlot.value.time,
          name: formData.name,
          email: formData.email
        }))

        router.push('/confirmation')
      } catch (err) {
        error.value = 'Failed to create booking. Please try again.'
        console.error('Error creating booking:', err)
      } finally {
        submitting.value = false
      }
    }

    return {
      selectedDate,
      selectedTimeSlot,
      timeSlots,
      loading,
      error,
      submitting,
      formData,
      minDate,
      fetchTimeSlots,
      selectTimeSlot,
      submitBooking,
      handleDateSelected
    }
  }
}
</script>

<style scoped>
.booking-page {
  display: flex;
  flex-direction: column;
}

.calendar-section,
.booking-form {
  padding: 1rem;
}

.calendar-container {
  margin-top: 1rem;
}

.date-picker {
  margin-bottom: 1rem;
}

.date-picker input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
}

.time-slot {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.time-slot:hover:not(:disabled) {
  background: #f0f0f0;
}

.time-slot.unavailable {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:hover:not(:disabled) {
  background: #3aa876;
}

.submit-btn:disabled {
  background: #9be0c0;
  cursor: not-allowed;
}

.loading,
.error,
.no-slots {
  text-align: center;
  padding: 1rem;
  margin: 1rem 0;
}

.error {
  color: #dc3545;
}

.loading {
  color: #666;
}
</style> 