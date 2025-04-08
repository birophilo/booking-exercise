<template>
  <div class="flex flex-col max-w-7xl mx-auto p-8">
    <h2 class="text-2xl font-medium text-gray-700 mb-8">Select a Date and Time</h2>

    <div class="flex flex-col lg:flex-row lg:gap-8">
      <!-- Calendar Section -->
      <div class="w-full lg:w-1/2">
        <CalendarGrid @date-selected="handleDateSelected" />
      </div>

      <!-- Time Slots Section -->
      <div class="w-full lg:w-1/2 mt-8 lg:mt-0">
        <div v-if="showTimeSlots">
          <div v-if="loadingTimeSlots" class="flex flex-col items-center justify-center my-8">
            <div class="w-10 h-10 border-4 border-gray-200 rounded-full border-t-gray-700 animate-spin mb-4"></div>
            <p class="text-gray-600">Loading available time slots...</p>
          </div>
          <div v-else>
            <TimeSlotContainer
              :slots="store.slots[store.selectedDate] || []"
              @select-slot="openConfirmModal"
            />
          </div>
        </div>
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
