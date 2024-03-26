interface Schedule {
  employeeId: number
  start: string
  end: string
  day: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"
  role: "Server" | "Chef" | "Dishwasher" | "Manager"
}

export const getSchedule = async (): Promise<Schedule[]> => {
  console.debug("Fetching schedule")
  await new Promise((resolve) => setTimeout(resolve, 3000)) // delay result by 3 seconds
  return [
    {
      employeeId: 1,
      start: "1200",
      end: "2000",
      day: "Monday",
      role: "Server",
    },
  ]
}
