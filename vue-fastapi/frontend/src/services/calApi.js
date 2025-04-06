const API_KEY = import.meta.env.VITE_CAL_API_KEY
const USER_ID = import.meta.env.VITE_CAL_USER_ID
const API_URL = import.meta.env.VITE_CAL_API_URL

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
}

export const calApi = {
  async getSlots(date) {
    const params = new URLSearchParams();

    params.append('startTime', `${'2025-04-07'}T00:00:00Z`)
    params.append('endTime', `${'2025-04-07'}T23:59:59Z`)
    params.append('timeZone', 'Europe/London')
    params.append('eventTypeId', 2211735)

    try {
      const response = await fetch(`http://localhost:8000/slots?${params.toString()}`, {
        method: 'GET',
        headers
      })

      if (!response.ok) {
        throw new Error('Failed to fetch availability')
      }

      const data = await response.json()
      console.log(data)
      return data.slots.map(slot => ({
        time: new Date(slot.startTime).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        available: true,
        startTime: slot.startTime,
        endTime: slot.endTime
      }))
    } catch (error) {
      console.error('Error fetching availability:', error)
      throw error
    }
  },

  async createBooking(bookingData) {
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userId: USER_ID,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          name: bookingData.name,
          email: bookingData.email
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create booking')
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  }
} 