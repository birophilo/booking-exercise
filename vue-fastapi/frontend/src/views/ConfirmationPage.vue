<template>
  <div class="confirmation-page">
    <div class="confirmation-card">
      <div class="success-icon">✓</div>
      <h2>Booking Confirmed!</h2>
      <p>Your appointment has been successfully scheduled.</p>
      <div class="booking-details" v-if="bookingDetails">
        <p><strong>Date:</strong> {{ formatDate(bookingDetails.date) }}</p>
        <p><strong>Time:</strong> {{ bookingDetails.time }}</p>
        <p><strong>Name:</strong> {{ bookingDetails.name }}</p>
        <p><strong>Email:</strong> {{ bookingDetails.email }}</p>
      </div>
      <div v-else class="error">
        No booking details found. Please make a new booking.
      </div>
      <button class="new-booking-btn" @click="goToBooking">Book Another Appointment</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ConfirmationPage',
  setup() {
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

    const goToBooking = () => {
      router.push('/')
    }

    return {
      bookingDetails,
      formatDate,
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
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.success-icon {
  font-size: 4rem;
  color: #42b983;
  margin-bottom: 1rem;
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
  padding: 0.75rem 1.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.new-booking-btn:hover {
  background: #3aa876;
}
</style> 