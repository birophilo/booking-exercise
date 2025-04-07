import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    slots: [],
    selectedDate: '',
    selectedBranch: {},
    bookingDetails: {}
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
    },
    setBookingDetails(bookingDetails) {
      this.bookingDetails = bookingDetails
    }
  }
})