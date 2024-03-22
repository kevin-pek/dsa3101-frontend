interface Employee {
  id: number
  name: string
  type: "FT" | "PT"
  availability?: {
    day: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"
    start: string
    end: string
  }[]
}

export const getEmployees = async (): Promise<Employee[]> => {
  console.debug("Fetching employees")
  await new Promise((resolve) => setTimeout(resolve, 3000)) // delay result by 3 seconds
  return [
    { id: 1, name: "John", type: "FT" },
    {
      id: 2,
      name: "Madden",
      type: "PT",
      availability: [{ day: "Monday", start: "1000", end: "1600" }],
    },
  ]
}
