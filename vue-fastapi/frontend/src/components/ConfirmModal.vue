<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" @click="closeModal">
    <div class="bg-white rounded-lg w-11/12 max-w-md shadow-lg overflow-hidden" @click.stop>
      <div class="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 class="text-xl font-medium text-gray-800 m-0">Confirm Appointment</h3>
        <button class="bg-transparent border-none text-2xl cursor-pointer text-gray-600 hover:text-gray-800 p-0 leading-none" @click="closeModal">&times;</button>
      </div>
      <div class="p-6">
        <div v-if="submitting" class="flex flex-col items-center justify-center py-8">
          <div class="w-10 h-10 border-4 border-gray-200 rounded-full border-t-gray-800 animate-spin mb-4"></div>
          <p>Submitting your booking...</p>
        </div>
        <div v-else>
          <div class="mt-4 p-4 bg-gray-50 rounded-md">
            <p class="font-medium text-gray-800 my-2">{{ formatDate(date) }}, {{ formatTime(time) }}</p>
            <p class="text-gray-600 text-sm my-2">
              Cubitts {{ store.selectedBranch.name }}
            </p>
            <p class="text-gray-600 text-sm my-2">
              {{ store.selectedBranch.address }},
              {{ store.selectedBranch.postcode }}.
            </p>
          </div>

          <div class="mt-6">
            <div class="mb-4">
              <label for="name" class="block mb-2 font-medium text-gray-800">please enter your full name</label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                placeholder="name"
                required
                class="w-full p-3 border border-gray-300 rounded-md text-base transition-colors focus:outline-none focus:border-blue-500"
              />
            </div>

            <div class="mb-4">
              <label for="email" class="block mb-2 font-medium text-gray-800">your email address</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                placeholder="email"
                required
                class="w-full p-3 border border-gray-300 rounded-md text-base transition-colors focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end p-4 border-t border-gray-200 gap-4">
        <button 
          class="px-4 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-700 font-medium cursor-pointer transition-colors hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed" 
          @click="closeModal" 
          :disabled="submitting"
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-blue-500 border-none rounded-md text-white font-medium cursor-pointer transition-colors hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
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