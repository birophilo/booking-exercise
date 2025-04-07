<template>
  <div class="calendar-grid">
    <div class="calendar-header">
      <div class="month-navigation">
        <button 
          class="nav-button" 
          @click="previousMonth" 
          aria-label="Previous month"
          :disabled="isCurrentMonth"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            class="lucide lucide-chevron-left w-5 h-5"
            :class="{ 'opacity-50': isCurrentMonth }"
          >
            <path d="m15 18-6-6 6-6"></path>
          </svg>
        </button>
        <h3 class="text-xl font-medium">{{ currentMonthName }} {{ currentYear }}</h3>
        <button 
          class="nav-button" 
          @click="nextMonth" 
          aria-label="Next month"
          :disabled="isNextMonth"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            class="lucide lucide-chevron-right w-5 h-5"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="calendar-days">
      <div v-for="day in daysOfWeek" :key="day" class="day-header">
        {{ day.toUpperCase() }}
      </div>
    </div>
    
    <div class="calendar-body">
      <div
        v-for="(week, weekIndex) in calendarWeeks"
        :key="weekIndex"
        class="calendar-week"
      >
        <button
          v-for="(day, dayIndex) in week" 
          :key="dayIndex" 
          class="calendar-day"
          :disabled="isPastDay(day)"
          :class="{
            'empty-day': !day || isPastDay(day),
            'current-day': isCurrentDay(day),
            'selected-day': isSelectedDay(day)
          }"
          @click="day && selectDay(day)"
        >
          {{ day ? day.getDate() : '' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '../store'
import { formatDateToYYYYMMDD } from '../utils.js'

const store = useStore()
const currentDate = ref(new Date())
const selectedDate = ref(null)
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Computed properties
const currentYear = computed(() => {
  return currentDate.value.getFullYear()
})

const currentMonth = computed(() => {
  return currentDate.value.getMonth()
})

const currentMonthName = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long' })
})

const isCurrentMonth = computed(() => {
  const today = new Date()
  return currentDate.value.getMonth() === today.getMonth() &&
         currentDate.value.getFullYear() === today.getFullYear()
})

const isNextMonth = computed(() => {
  const today = new Date()
  currentDate.value > today
  return currentDate.value.getMonth() - today.getMonth() === 1 &&
         currentDate.value > today
})

const calendarWeeks = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)

  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()
  
  const days = []
  
  // Add empty slots for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null)
  }
  
  // Add all days in the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i))
  }
  
  // Group days into weeks
  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  
  // Ensure the last week is complete (add nulls if needed)
  const lastWeek = weeks[weeks.length - 1]
  while (lastWeek.length < 7) {
    lastWeek.push(null)
  }
  
  return weeks
})

// METHODS

const isCurrentDay = (day) => {
  if (!day) return false
  
  const today = new Date()
  return day.getDate() === today.getDate() && 
         day.getMonth() === today.getMonth() && 
         day.getFullYear() === today.getFullYear()
}

const isPastDay = (day) => {
  const today = new Date()
  return day < today
}

const isSelectedDay = (day) => {
  if (!day || !selectedDate.value) return false
  
  return day.getDate() === selectedDate.value.getDate() && 
         day.getMonth() === selectedDate.value.getMonth() && 
         day.getFullYear() === selectedDate.value.getFullYear()
}

const selectDay = (day) => {
  selectedDate.value = day
  store.setSelectedDate(formatDateToYYYYMMDD(day))
  emit('date-selected', day)
}

const previousMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
  emit('month-changed', currentDate.value)
}

const nextMonth = () => {
  // Create a new date object to avoid mutating the original
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
  emit('month-changed', currentDate.value)
}

const emit = defineEmits(['date-selected', 'month-changed'])
</script>

<style scoped>
.calendar-grid {
  width: 100%;
  border: 1px solid #fff;
  border-radius: 0.5rem;
  overflow: hidden;
}

.calendar-header {
  border-bottom: 1px solid #fff;
}

.month-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  transition: all 0.2s;
  margin: 0 20px;
  border: none;
}

.nav-button:hover:not(:disabled) {
  background-color: #e2e8f0;
  color: #1e293b;
}

.nav-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #fff;
}

.day-header {
  padding: 0.5rem;
  text-align: center;
  font-weight: 500;
  font-size: 0.7rem;
  letter-spacing: 0.5px;
  color: black;
}

.calendar-body {
  display: flex;
  flex-direction: column;
}

.calendar-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid #fff;
}

.calendar-week:last-child {
  border-bottom: none;
}

.calendar-day {
  text-align: center;
  font-size: 1rem;
  cursor: pointer;
  margin: 3px;
  height: 50px;
  border: none;
}

.calendar-day:hover:not(.empty-day) {
  background-color: #f1f5f9;
}

.empty-day {
  cursor: default;
}

.current-day {
  font-weight: bold;
  color: #3b82f6;
}

.selected-day {
  background-color: #3b82f6;
  color: white;
}

.selected-day:hover {
  background-color: #2563eb;
}
</style> 