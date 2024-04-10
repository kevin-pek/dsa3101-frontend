// Adapted from NUSmods https://github.com/nusmodifications/nusmods/blob/master/website/src/utils/timify.ts

import { Role } from "../types/employee"
import { Shift } from "../types/schedule"

export function convertTimeToIndex(timeStr: string): number {
  // Normalize the time string to ensure it's in a consistent format
  const normalizedTimeStr = timeStr.replace(':', '');

  // Determine if it's half past the hour
  const isHalfHour = normalizedTimeStr.includes('30');

  // Extract the hour and period (am/pm)
  let [hourPart, period] = normalizedTimeStr.split(/(am|pm)/);
  let hour = parseInt(hourPart, 10);

  // Correct for 12am and 12pm
  if (hour === 12) {
      hour = 0;
  }
  if (period === 'pm') {
      hour += 12;
  }

  // Calculate the number (0 to 47)
  let number = hour * 2;
  if (isHalfHour) {
      number += 1;
  }

  return number;
}


// Converts a 24-hour format time string to an index.
// Each index corresponds to one cell of each timetable row.
export function convertIndexToTime(number: number): string {
  if (number < 0 || number > 47) {
      throw new Error('Number must be between 0 and 47');
  }

  // Determine if it's on the hour or half-hour
  const isHalfHour = number % 2 !== 0;

  // Convert the number to hours
  let hour = Math.floor(number / 2);

  // Determine AM or PM and adjust hour for 12-hour format
  let period = 'am';
  if (hour >= 12) {
      period = 'pm';
      if (hour > 12) hour -= 12;
  }
  if (hour === 0) hour = 12;

  // Construct the time string
  let time = `${hour}`;
  if (isHalfHour) {
      time += ':30';
  }
  time += period;

  return time;
}

/**
 * Compares 2 dates only using the year month and date. Returns -1 if first is
 * before the other, 0 if they are the same day, and 1 if first is after the
 * second date.
 */

export function compareDates(date1, date2) {
  // Extract the year, month, and day from the first date
  const year1 = date1.getFullYear();
  const month1 = date1.getMonth();
  const day1 = date1.getDate();

  // Extract the year, month, and day from the second date
  const year2 = date2.getFullYear();
  const month2 = date2.getMonth();
  const day2 = date2.getDate();

  // Compare the year, then month, then day
  if (year1 < year2) return -1;
  if (year1 > year2) return 1;

  // If the years are the same, compare the months
  if (month1 < month2) return -1;
  if (month1 > month2) return 1;

  // If the months are also the same, compare the days
  if (day1 < day2) return -1;
  if (day1 > day2) return 1;

  // If all are the same, the dates are identical (in terms of day, month, and year)
  return 0;
}

export const shiftToString = (shift: Shift, role: Role) => {
  const start = role === Role.Kitchen ? "8am" : "10pm"
  const end = role === Role.Server ? "10am" : "10pm"
  if (shift === Shift.Full) {
    return `${start} - ${end}`
  } else if (shift === Shift.Morning) {
    return `${start} -  6pm`
  } else if (shift === Shift.Night) {
    return `12pm - ${end}`
  }
  return "Unselected"
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
