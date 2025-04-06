const API_KEY = import.meta.env.VITE_CAL_API_KEY
const USER_ID = import.meta.env.VITE_CAL_USER_ID
const API_URL = import.meta.env.VITE_CAL_API_URL

const BACKEND_BASE_URL = 'http://localhost:8000'


const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
}

export const calApi = {
  async getSlots(date) {
    const params = new URLSearchParams();

    const today = new Date()
    const weekLater = new Date()
    weekLater.setDate(today.getDate() + 8)


    params.append('startTime', today.toISOString().slice(0, 10))
    params.append('endTime', weekLater.toISOString().slice(0, 10))
    params.append('timeZone', 'Europe/London')
    params.append('eventTypeId', 2211735)

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/slots?${params.toString()}`, {
        method: 'GET',
        headers
      })

      if (!response.ok) {
        throw new Error('Failed to fetch availability')
      }

      const data = await response.json()
      console.log(data)
      return data
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