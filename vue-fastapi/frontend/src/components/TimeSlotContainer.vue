<template>
  <div class="time-slot-container">
    <button
      v-for="slot in slots"
      :key="slot.time"
      class="time-slot"
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

<style scoped>
.time-slot-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.1rem;
  margin-top: 1.5rem;
}

.time-slot {
  background-color: #f0f0f0;
  border: none;
  width: 6rem;
  height: 3rem;
  padding: 0.5rem;
  margin: 0.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  color: #333;
  transition: background-color 0.1s ease;
}

.time-slot:hover {
  background-color: #e0e0e0;
}
</style> 