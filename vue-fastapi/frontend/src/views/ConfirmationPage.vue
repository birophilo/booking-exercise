<template>
  <div class="confirmation-page">
    <div class="confirmation-card" v-if="store.bookingDetails">
      <img :src="confirmationPageImage" width="100%" />
      <h2>Booking Confirmed</h2>
      <p>Your eye test has been booked for:</p>
      <p>
        {{ formatDate(store.bookingDetails.date) }}<br />
        time: {{ formatTime(store.bookingDetails.date) }}
      </p>
      <p>
        Cubitts {{ store.bookingDetails.branch.name }}<br />
        {{ store.bookingDetails.branch.address }}, {{ store.bookingDetails.branch.postcode }}.
      </p>
      <button class="new-booking-btn" @click="goToBooking">Return to booking page</button><br />
      <button class="new-booking-btn" @click="goToBooking">Cubitts</button><br />
    </div>
    <div v-else class="error">
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
      return new Date(dateString).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }

    const goToBooking = () => {
      router.push('/')
    }

    return {
      store,
      bookingDetails,
      confirmationPageImage,
      formatDate,
      formatTime,
      goToBooking
    }
  }
}
</script>

<style scoped>
.confirmation-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.confirmation-card {
  text-align: center;
  background: white;
  width: 100%;
}

.booking-details {
  margin: 2rem 0;
  text-align: left;
  padding: 1rem;
  background: #f8f8f8;
  border-radius: 4px;
}

.booking-details p {
  margin: 0.5rem 0;
}

.error {
  color: #dc3545;
  margin: 1rem 0;
}

.new-booking-btn {
  padding: 0.2rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.new-booking-btn:hover {
  background: #3aa876;
}
</style> 