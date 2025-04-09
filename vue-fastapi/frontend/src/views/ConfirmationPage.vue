<template>
  <div class="max-w-7xl mx-auto p-2">
    <div class="bg-white overflow-hidden max-w-2xl mx-auto p-4" v-if="store.bookingDetails">
      <img :src="confirmationPageImage" class="w-full h-auto mb-6" />
      <h2 class="text-2xl font-light text-center text-gray-800 mb-4">Booking Confirmed</h2>
      <p class="text-gray-600 mb-2 text-center font-light">Your eye test has been booked for:</p>
      <p class="text-gray-800 text-center font-medium mb-4">
        {{ formatDate(store.bookingDetails.date) }}<br />
        {{ formatTime(store.bookingDetails.date) }}
      </p>
      <p class="text-gray-600 mb-6 font-light text-center">
        Cubitts {{ store.bookingDetails.branch.name }}<br />
        {{ store.bookingDetails.branch.address }},<br/>
        {{ store.bookingDetails.branch.postcode }}.
      </p>
      <div class="flex flex-col items-center">
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white font-light py-2 px-4 rounded-md transition-colors mb-3 w-full sm:w-3/4 md:w-1/2"
          @click="goToBooking"
        >Back to booking page</button>
        <button
          class="text-blue-600 hover:text-blue-800 hover:underline font-light py-2 px-4 transition-colors w-full sm:w-3/4 md:w-1/2"
          @click="goToHome"
        >Home</button>
      </div>
    </div>
    <div v-else class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md max-w-2xl mx-auto">
      No booking details could be loaded. Please check your email for booking details.
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../store'
import confirmationPageImage from '../assets/confirmation.jpg'

export default {
  name: 'ConfirmationPage',
  setup() {
    const store = useStore()
    const router = useRouter()
    const bookingDetails = ref(null)

    onMounted(() => {
      const storedBooking = localStorage.getItem('lastBooking')
      if (storedBooking) {
        bookingDetails.value = JSON.parse(storedBooking)
      }
    })

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatTime = (dateString) => {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const goToBooking = () => {
      router.push('/booking')
    }

    const goToHome = () => {
      router.push('/')
    }

    return {
      store,
      bookingDetails,
      confirmationPageImage,
      formatDate,
      formatTime,
      goToBooking,
      goToHome
    }
  }
}
</script>
