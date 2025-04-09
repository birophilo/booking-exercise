<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-6">
    <button
      v-for="slot in slots"
      :key="slot.time"
      class="bg-gray-100 border-none w-full h-12 p-2 rounded cursor-pointer text-base text-gray-800 transition-colors hover:bg-gray-200"
      @click="selectTimeSlot(slot)"
    >
      {{ formatSlotTime(slot.time) }}
    </button>
  </div>
</template>

<script>

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
    const formatSlotTime = (dateString) => {
      return new Date(dateString).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    const selectTimeSlot = (slot) => {
      emit('select-slot', slot)
    }

    return {
      formatSlotTime,
      selectTimeSlot
    }
  }
}
</script>
