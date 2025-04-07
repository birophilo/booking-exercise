const API_KEY = import.meta.env.VITE_CAL_API_KEY
const USER_ID = import.meta.env.VITE_CAL_USER_ID
const API_URL = import.meta.env.VITE_CAL_API_URL

const BACKEND_BASE_URL = 'http://localhost:8000'

const EYE_TEST_LENGTH_MINUTES = 20

const dataForBookingResponse = {
  "name": "",
  "email": "",
  "smsReminderNumber": "",
  "location": {
    "value": "userPhone",
    "optionValue": ""
  }
}

const bookingPayload = {
  "start": "",
  "end": "",
  "storeName": "",
  "responses": {},
  "timeZone": "Europe/London",
  "language": "en",
  "title": "",
  "description": null,
  "status": "PENDING",
  "metadata": {}
}

function createBookingPayload({
  startTime, name, email, storeName
}) {
  const payload = {...bookingPayload}

  let endTime = new Date(startTime)
  endTime.setMinutes(endTime.getMinutes() + EYE_TEST_LENGTH_MINUTES)

  payload.start = startTime
  payload.end = endTime
  payload.title = `Cubitts eye test at: ${location}`
  payload.storeName = storeName

  const dataForResponses = {...dataForBookingResponse}

  dataForResponses.name = name
  dataForResponses.email = email

  payload.responses = dataForResponses

  return payload
}

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
}

export const calApi = {
  async getSlots(storeName, date) {
    const params = new URLSearchParams();

    const weekLater = new Date(date)
    weekLater.setDate(date.getDate() + 8)




    params.append('startTime', date.toISOString().slice(0, 10))
    params.append('endTime', weekLater.toISOString().slice(0, 10))
    params.append('timeZone', 'Europe/London')
    params.append('storeName', storeName)

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
    const bookingPayload = createBookingPayload(bookingData)
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/bookings`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bookingPayload)
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