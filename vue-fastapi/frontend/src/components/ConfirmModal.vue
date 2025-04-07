<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Confirm Appointment</h3>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <div v-if="submitting" class="loading-container">
          <div class="spinner"></div>
          <p>Submitting your booking...</p>
        </div>
        <div v-else>
          <div class="appointment-details">
            <p class="date">{{ formatDate(date) }}, {{ formatTime(time) }}</p>
            <p class="location">
              Cubitts {{ store.selectedBranch.name }}
            </p>
            <p class="location">
              {{ store.selectedBranch.address }},
              {{ store.selectedBranch.postcode }}.
            </p>
          </div>

          <div class="form-container">
            <div class="form-group">
              <label for="name">please enter your full name</label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                placeholder="name"
                required
              />
            </div>

            <div class="form-group">
              <label for="email">your email address</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                placeholder="email"
                required
              />
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-button" @click="closeModal" :disabled="submitting">Cancel</button>
        <button
          class="confirm-button"
          @click="confirm"
          :disabled="!isFormValid || submitting"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineProps, defineEmits, ref, computed } from 'vue'
import { useStore } from '../store'

export default {
  name: 'ConfirmModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    location: {
      type: String,
      default: ''
    },
    formData: {
      type: Object,
      required: true
    },
    submitting: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'confirm', 'update:formData'],
  setup(props, { emit }) {

    const store = useStore()

    const closeModal = () => {
      emit('close')
    }

    const confirm = () => {
      if (isFormValid.value) {
        emit('confirm')
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }

    const formatTime = (timeString) => {
      if (!timeString) return ''
      const date = new Date(timeString)
      return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const isFormValid = computed(() => {
      return props.formData.name && props.formData.email &&
             props.formData.email.includes('@') &&
             props.formData.email.includes('.')
    })

    return {
      store,
      closeModal,
      confirm,
      formatDate,
      formatTime,
      isFormValid
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  line-height: 1;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  padding: 1.5rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
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

.appointment-details {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.appointment-details p {
  margin: 0.5rem 0;
}

.date, .time {
  font-weight: 500;
  color: #333;
}

.location {
  color: #666;
  font-size: 0.9rem;
}

.form-container {
  margin-top: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  gap: 1rem;
}

.cancel-button {
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: #e5e7eb;
}

.confirm-button {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirm-button:hover {
  background-color: #2563eb;
}

.confirm-button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.cancel-button:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}
</style> 