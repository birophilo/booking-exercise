<template>
  <div class="max-w-7xl mx-auto p-8">
    <div class="bg-white rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto p-6" v-if="store.bookingDetails">
      <img :src="confirmationPageImage" class="w-full h-auto mb-6" />
      <h2 class="text-2xl font-medium text-gray-800 mb-4">Booking Confirmed</h2>
      <p class="text-gray-600 mb-2">Your eye test has been booked for:</p>
      <p class="text-gray-800 font-medium mb-4">
        {{ formatDate(store.bookingDetails.date) }}<br />
        time: {{ formatTime(store.bookingDetails.date) }}
      </p>
      <p class="text-gray-600 mb-6">
        Cubitts {{ store.bookingDetails.branch.name }}<br />
        {{ store.bookingDetails.branch.address }}, {{ store.bookingDetails.branch.postcode }}.
      </p>
      <button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors mb-3 w-full" @click="goToBooking">Return to booking page</button>
      <button class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors w-full" @click="goToHome">Cubitts</button>
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
