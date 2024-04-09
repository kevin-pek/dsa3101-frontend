// Adapted from NUSmods https://github.com/nusmodifications/nusmods/blob/master/website/src/utils/timify.ts

import { Role } from "../types/employee"
import { Shift } from "../types/schedule"

export function getLessonTimeHours(time: string): number {
  return parseInt(time.substring(0, 2), 10)
}

export function getLessonTimeMinutes(time: string): number {
  return parseInt(time.substring(2), 10)
}

// Converts a 24-hour format time string to an index.
// Each index corresponds to one cell of each timetable row.
// Each row may not start from index 0, it depends on the config's starting time.
// 0000 -> 0, 0030 -> 1, 0100 -> 2, ...
export function convertTimeToIndex(time: string): number {
  const hour = getLessonTimeHours(time)
  const minute = getLessonTimeMinutes(time)

  // TODO: Expose incorrect offsets to user via UI
  // Currently we round up in half hour blocks, but the actual time is not shown
  let minuteOffset
  if (minute === 0) {
    minuteOffset = 0
  } else if (minute <= 30) {
    minuteOffset = 1
  } else {
    minuteOffset = 2
  }

  return hour * 2 + minuteOffset
}

// Reverse of convertTimeToIndex.
// 0 -> 0000, 1 -> 0030, 2 -> 0100, ... , 48 -> 2400
export function convertIndexToTime(index: number): string {
  const timeIndex = Math.min(index, 48)
  const hour: number = Math.floor(timeIndex / 2)
  const minute: string = timeIndex % 2 === 0 ? "00" : "30"
  return (hour < 10 ? `0${hour}` : hour.toString()) + minute
}

export const shiftToString = (shift: Shift, role: Role) => {
  const start = role === Role.Kitchen ? " 8am" : "10pm"
  const end = role === Role.Server ? "10am" : "10pm"
  if (shift === Shift.Full) {
    return `${start} - ${end}`
  } else if (shift === Shift.Morning) {
    return `${start} -  6pm`
  } else if (shift === Shift.Night) {
    return `12pm - ${end}`
  }
  return "Unavailablee"
}

export const stringToShift = (str: string) => {
  const morn = str.startsWith(" 8am") || str.startsWith("10am")
  const night = str.endsWith("10pm")
  if (morn && night) {
    return Shift.Full
  } else if (morn) {
    return Shift.Morning
  } else if (night) {
    return Shift.Night
  }
}