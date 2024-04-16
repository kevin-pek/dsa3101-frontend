import axios from "axios"
import faker from "faker"
import { ActualDemand, PredictedDemand } from "../types/demand"
import { Wage, Role, dayType } from "../types/employee"
import { getPastTwelveMonths, getSevenDaysBeforeAndAfter } from "../utils/time"
import dayjs from "dayjs"
import { DoW } from "../types/constants"
import { useMemo } from 'react'

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
    const time = getPastTwelveMonths()
    if (url === "/get_past_demand") return generateActualDemand(time)
    if (url === "/get_demand_forecast")
      return generatePredictedDemand([time[0], getSevenDaysBeforeAndAfter()[1]])
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

function generateWorkingHoursTimeString(hour) {
  const minutes = faker.datatype.number({ min: 0, max: 59 }).toString().padStart(2, "0")
  const seconds = faker.datatype.number({ min: 0, max: 59 }).toString().padStart(2, "0")
  return `${hour.toString().padStart(2, "0")}:${minutes}:${seconds}`
}

export function generatePredictedDemand(dateRange: [Date, Date]): PredictedDemand[] {
  const [startDate, endDate] = dateRange
  const startDay = dayjs(startDate)
  const endDay = dayjs(endDate)
  const differenceInDays = endDay.diff(startDay, "day")

  const demand: PredictedDemand[] = []

  for (let dayIndex = 0; dayIndex <= differenceInDays; dayIndex++) {
    const currentDay = startDay.add(dayIndex, "days").format("YYYY-MM-DD")

    // Generate data for each hour within the working hours (10:00 to 21:00)
    for (let hour = 10; hour <= 21; hour++) {
      const time = generateWorkingHoursTimeString(hour)
      const dayOfWeek = dayjs(`${currentDay}T${time}`).format("dddd") // Get day of the week
      const customers = faker.datatype.number({ min: 10, max: 100 })

      demand.push({
        date: currentDay,
        time,
        day: dayOfWeek as DoW,
        customers,
      })
    }
  }

  return demand
}

export function generateActualDemand(dateRange: [Date, Date]): ActualDemand[] {
  const [startDate, endDate] = dateRange
  const startDay = dayjs(startDate)
  const endDay = dayjs(endDate)
  const differenceInDays = endDay.diff(startDay, "day")

  const actualDemand: ActualDemand[] = []

  for (let dayIndex = 0; dayIndex <= differenceInDays; dayIndex++) {
    const currentDay = startDay.add(dayIndex, "days").format("YYYY-MM-DD")

    // Generate data for each hour within the working hours (10:00 to 21:00)
    for (let hour = 10; hour <= 21; hour++) {
      const time = generateWorkingHoursTimeString(hour)
      const dayOfWeek = dayjs(`${currentDay}T${time}`).format("dddd") // Get day of the week
      const customers = faker.datatype.number({ min: 10, max: 100 })

      actualDemand.push({
        date: currentDay,
        time,
        day: dayOfWeek as DoW,
        customers,
      })
    }
  }

  return actualDemand
}

function generateWage(employeeCount: number, isPartTime: boolean, startDate: Date, endDate: Date): Wage[] {
  return useMemo(() => {
    const wages: Wage[] = [];
    const roles = Object.values(Role);
    const days = Object.values(dayType);
    const wageMap: Record<Role, number> = {
      [Role.Manager]: 0,
      [Role.Service]: 0,
      [Role.Kitchen]: 0,
    };

    // Generate a map of roles to wages for full-time employees
    if (!isPartTime) {
      roles.forEach((role) => {
        wageMap[role] = faker.datatype.number({ min: 1500, max: 3000 }); //generate random wage for each role
      });
    }

    // Generate wages for each month within the date range
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      // Generate wages for each employee
      for (let i = 0; i < employeeCount; i++) {
        const roleIndex = Math.floor(Math.random() * roles.length); 
        const dayIndex = Math.floor(Math.random() * days.length); 

        const role = roles[roleIndex]; //assign a random role
        const day = days[dayIndex]; //assign a random day

        let wage: number;

        if (isPartTime) {
          wage = 0; // Part-time staff will have wage 0 under 'Employees' table
        } else {
          // Full-time employees under the same role have the same wage
          wage = wageMap[role];
        }

        wages.push({ day, role, wage });
      }

      // Move to the next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return wages;
  }, [employeeCount, isPartTime, startDate, endDate]);
}

export default generateWage;
