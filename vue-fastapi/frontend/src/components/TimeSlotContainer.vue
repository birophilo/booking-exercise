<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 mt-3">
    <button
      v-for="slot in slots"
      :key="slot.time"
      class="border-none w-full h-12 p-2 cursor-pointer font-light text-gray-800 transition-colors hover:bg-orange-400"
      :class="{
        'bg-orange-400': slot === selectedSlot,
        'bg-orange-100': slot !== selectedSlot
    }"
      @click="selectTimeSlot(slot)"
    >
      {{ formatSlotTime(slot.time) }}
    </button>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'TimeSlotContainer',
  props: {
    slots: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  emits: ['select-slot'],
  setup(props, { emit }) {

    const selectedSlot = ref(null)

    const formatSlotTime = (dateString) => {
      return new Date(dateString).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    const selectTimeSlot = (slot) => {
      selectedSlot.value = slot
      emit('select-slot', slot)
    }


    return {
      formatSlotTime,
      selectTimeSlot,
      selectedSlot
    }
  }
}
</script>
