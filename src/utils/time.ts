import { Role } from "../types/employee"
import { Shift } from "../types/schedule"

// converts 1pm 1:30pm string to index
export function convertTimeToIndex(timeStr: string): number {
  const isHalfHour = timeStr.includes(":30")
  const normalizedTimeStr = timeStr.replace(":30", "")
  let [hourPart, period] = normalizedTimeStr.split(/(am|pm)/)
  let hour = parseInt(hourPart)
  if (hour === 12) {
    hour = 0
  }
  if (period === "pm") {
    hour += 12
  }
  // Calculate the number (0 to 47)
  let number = hour * 2
  if (isHalfHour) {
    number += 1
  }
  return number
}

// Converts a 24-hour format time string to an index.
// Each index corresponds to one cell of each timetable row.
export function convertIndexToTime(number: number): string {
  if (number < 0 || number > 47) {
    throw new Error("Number must be between 0 and 47")
  }
  const isHalfHour = number % 2 !== 0
  let hour = Math.floor(number / 2)
  let period = "am"
  if (hour >= 12) {
    period = "pm"
    if (hour > 12) hour -= 12
  }
  if (hour === 0) hour = 12
  let time = `${hour}`
  if (isHalfHour) {
    time += ":30"
  }
  time += period
  return time
}

/**
 * Compares 2 dates only using the year month and date. Returns -1 if first is
 * before the other, 0 if they are the same day, and 1 if first is after the
 * second date.
 */
export function compareDates(date1, date2) {
  const year1 = date1.getFullYear()
  const month1 = date1.getMonth()
  const day1 = date1.getDate()

  const year2 = date2.getFullYear()
  const month2 = date2.getMonth()
  const day2 = date2.getDate()

  if (year1 < year2) return -1
  if (year1 > year2) return 1

  if (month1 < month2) return -1
  if (month1 > month2) return 1

  if (day1 < day2) return -1
  if (day1 > day2) return 1

  return 0
}

export const shiftToString = (shift: Shift, role: Role) => {
  const start = role === Role.Kitchen ? "8am" : "10am"
  const end = "10pm"
  if (shift === Shift.Full) {
    return `${start} - ${end}`
  } else if (shift === Shift.Morning) {
    return `${start} - 6pm`
  } else if (shift === Shift.Night) {
    return `12pm - ${end}`
  }
  return ""
}

export const stringToShift = (str: string) => {
  const morn = str.startsWith("8am") || str.startsWith("10am")
  const night = str.endsWith("10pm")
  if (morn && night) {
    return Shift.Full
  } else if (morn) {
    return Shift.Morning
  } else if (night) {
    return Shift.Night
  }
}

export const stringToTimeString = (str: string) => {
  const isHalfHour = str.includes(":30")
  const normalizedTimeStr = str.replace(":30", "")
  let [hourPart, period] = normalizedTimeStr.split(/(am|pm)/)
  let hour = parseInt(hourPart)
  if (hour === 12) {
    hour = 0
  }
  if (period === "pm") {
    hour += 12
  }
  return `${hour.toString().padStart(2, '0')}:${isHalfHour ? "30" : "00"}:00`
}

export const timeStringToString = (time: string) => {
  // Extract hours and minutes from the time string
  const [hours, minutes] = time.split(':').map(Number)
  // Determine if the time is AM or PM
  const period = hours >= 12 ? 'pm' : 'am'
  // Convert hour from 24-hour to 12-hour format
  let hour = hours % 12
  if (hour === 0) hour = 12 // If hour is 0, it means it's 12 AM
  // If minutes are 00, we don't need to include them in the final output
  const minutePart = minutes === 30 ? ':30' : ''
  // Construct the final string
  return `${hour}${minutePart}${period}`
}

export const getPastTwelveMonths = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set time to midnight to normalize the date
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(today.getMonth() - 11)

  return [sixMonthsAgo, today]
}

export const getPastFourteenDays = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set time to midnight to normalize the date
  today.setDate(today.getDate())
  const fourteenDaysAgo = new Date(today)
  fourteenDaysAgo.setDate(today.getDate() - 13)

  return [fourteenDaysAgo, today]
}

export const getSevenDaysBeforeAndAfter = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set time to midnight to normalize the date

  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 7)

  const sevenDaysAfter = new Date(today)
  sevenDaysAfter.setDate(today.getDate() + 7)

  return [sevenDaysAgo, sevenDaysAfter]
}
