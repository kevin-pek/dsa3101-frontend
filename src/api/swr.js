import { getBookings } from "./booking"
import { getEmployees } from "./employee"
import { getSchedule } from "./schedule"

// const BASE_URL = process.env.API_URL || "http://localhost:5173"
export const fetcher = async (url) => {
  // const response = await fetch(`${BASE_URL}${url}`)
  // if (!response.ok) {
  //   throw new Error("Error fetching data")
  // }
  // return await response.json()
  if (url === "Employee") return await getEmployees()
  if (url === "Booking") return await getBookings()
  if (url === "Schedule") return await getSchedule()
}
