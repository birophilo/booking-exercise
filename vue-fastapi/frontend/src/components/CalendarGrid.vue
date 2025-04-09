<template>
  <div class="w-full overflow-hidden bg-white">
    <h2 class="text-2xl font-light text-gray-800 mb-3 ml-2">Choose a date</h2>
    <div class="bg-slate-100">
      <div class="flex justify-center items-center py-3">
        <button 
          class="flex items-center justify-center w-8 h-8 transition-all duration-200 mx-5 border-none hover:bg-gray-200 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
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
            class="w-5 h-5"
            :class="{ 'opacity-50': isCurrentMonth }"
          >
            <path d="m15 18-6-6 6-6"></path>
          </svg>
        </button>
        <h3 class="text-lg font-extralight text-amber-500">{{ currentMonthName }} {{ currentYear }}</h3>
        <button 
          class="flex items-center justify-center w-8 h-8 transition-all duration-200 mx-5 border-none hover:bg-gray-200 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
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
            class="w-5 h-5"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="grid grid-cols-7">
      <div v-for="day in daysOfWeek" :key="day" class="p-2 text-center font-bold text-xs m-0.5 tracking-wider text-stone-500 bg-slate-100">
        {{ day.toUpperCase() }}
      </div>
    </div>
    
    <div class="flex flex-col">
      <div
        v-for="(week, weekIndex) in calendarWeeks"
        :key="weekIndex"
        class="grid grid-cols-7"
      >
        <button
          v-for="(day, dayIndex) in week" 
          :key="dayIndex" 
          class="text-center text-lg font-light cursor-pointer m-0.5 h-12 border-none transition-colors duration-100 disabled:cursor-default"
          :disabled="isPastDay(day)"
          :class="{
            'cursor-default text-stone-300 bg-slate-100 font-light': !day || isPastDay(day),
            'bg-orange-400 text-stone-100 hover:bg-amber-600': day && !isPastDay(day) && !isCurrentDay(day) && !isSelectedDay(day),
            'bg-amber-800 text-stone-100 hover:bg-amber-800': isSelectedDay(day)
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