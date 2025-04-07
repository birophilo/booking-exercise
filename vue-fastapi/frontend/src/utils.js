export function formatDateToYYYYMMDD(date) {
  const [day, month, year] = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Europe/London',
  }).formatToParts(date).reduce((acc, part) => {
    if (part.type !== 'literal') acc.push(part.value)
    return acc
  }, [])

  return `${year}-${month}-${day}`
}

export function getStartOfWeek(date) {
  const day = date.getDay() // 0 (Sun) to 6 (Sat)
  const diff = (day === 0 ? -6 : 1 - day) // Adjust when Sunday (0) to previous Monday
  const startDay = new Date(date)
  startDay.setDate(date.getDate() + diff)
  startDay.setHours(0, 0, 0, 0) // zero out time
  return startDay
}