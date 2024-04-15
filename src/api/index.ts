import { getStartOfWeek } from "@mantine/dates"
import axios from "axios"
import { Schedule, Shift } from "../types/schedule"
import { Role } from "../types/employee"
import { DoW } from "../types/constants"

const BASE_URL = "http://localhost:5001"

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const handleError = (error: unknown) => {
  // propagate error to be handled by swr
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw Error(error.response.data.message)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      throw Error(error.request)
    }
  } else if (error instanceof Error) {
    // Something happened in setting up the request that triggered an Error
    throw Error(error.message)
  }
  throw error
}

export const fetcher = async (url: string) => {
  try {
    const response = await apiClient.get(url)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

export const postRequest = async <T>(url: string, data: T) => {
  try {
    const response = await apiClient.post(url, data)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

export const putRequest = async <T>(url: string, id: number, data: T) => {
  try {
    const response = await apiClient.put(`${url}/${id}`, data)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

export const deleteRequest = async (url: string, id: number) => {
  try {
    const response = await apiClient.delete(`${url}/${id}`)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

// TODO: Remove these once integration with backend is done
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function generateSchedules(): Schedule[] {
  const roles = Object.values(Role)
  const daysOfWeek = Object.values(DoW)
  const shifts = Object.values(Shift)
  const schedules: Schedule[] = []
  const employeeIds = [1, 2, 3, 4, 5]

  employeeIds.forEach((employeeId) => {
    daysOfWeek.forEach((day) => {
      const role = roles[getRandomInt(0, roles.length - 1)]
      const shift = shifts[getRandomInt(0, shifts.length - 1)]

      // Initialize start and end with default values
      let start: string = "8am" // Default start time
      let end: string = "6pm" // Default end time

      if (role === "Kitchen" && shift === "Morning") {
        start = "8am"
        end = "6pm"
      } else if (role === "Server" && shift === "Morning") {
        start = "10am"
        end = "6pm"
      } else if (role === "Kitchen" && shift === "Night") {
        start = "12pm"
        end = "10pm"
      } else if (role === "Server" && shift === "Night") {
        start = "12pm"
        end = "10pm"
      } else if (shift === "Full") {
        start = role === "Kitchen" ? "8am" : "10am"
        end = "10pm"
      }

      const schedule: Schedule = {
        id: getRandomInt(100, 999),
        employeeId: employeeId,
        day: day,
        role: role,
        week: getStartOfWeek(new Date()), // For simplicity, using the current date
        shift: shift,
        start: start,
        end: end,
      }

      schedules.push(schedule)
    })
  })
  console.log(schedules)
  return schedules
}
