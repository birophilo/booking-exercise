import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    slots: [],
    selectedDate: ''
  }),
  actions: {
    setSlots(slots) {
      this.slots = slots
    },
    setSelectedDate(date) {
      this.selectedDate = date
    }
  }
})