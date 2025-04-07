import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    slots: [],
    selectedDate: '',
    selectedBranch: {}
  }),
  actions: {
    setSlots(slots) {
      this.slots = slots
    },
    setSelectedDate(date) {
      this.selectedDate = date
    },
    setSelectedBranch(branchName) {
      this.selectedBranch = branchName
    }
  }
})