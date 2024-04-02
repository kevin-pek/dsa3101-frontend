import { fakeEmployees } from "../sampleEmployees"
import { mutate } from "swr"

export interface Employee {
  id: number
  name: string
  type: "FT" | "PT"
  wage: number
  role: "Manager" | "Server" | "Cook" | "Dishwasher"
  mon: string
  tues: string
  wed: string
  thurs: string
  fri: string
  sat: string
  sun: string
}

export const getEmployees = async (): Promise<Employee[]> => {
  console.debug("Fetching employees")
  await new Promise((resolve) => setTimeout(resolve, 1000)) // delay result by 1 second
  return fakeEmployees
}

export const updateEmployee = async (
  updatedEmployee: Employee
): Promise<Employee[]> => {
  console.debug("Updating employee")

  await new Promise((resolve) => setTimeout(resolve, 1000)) // delay result by 1 second
  const updatedEmployees = fakeEmployees.map((employee) =>
    employee.id === updatedEmployee.id ? { ...employee, ...updatedEmployee } : employee
  )
  mutate("Employee", updatedEmployees)
  Object.assign(fakeEmployees, updatedEmployees)
  return updatedEmployees
}

export const deleteEmployee = async (
  employeeId: number
): Promise<Employee[]> => {
  console.debug("Deleting employee with ID:", employeeId)

  await new Promise((resolve) => setTimeout(resolve, 1000)) // delay result by 1 second
  const updatedEmployees = fakeEmployees.filter((employee) => employee.id !== employeeId)
  mutate("Employee", updatedEmployees)
  Object.assign(fakeEmployees, updatedEmployees)
  return updatedEmployees
}

export const saveEmployeesData = async (employees: Employee[]): Promise<void> => {
  console.log("Saving data for employees", employees.length)

  // send a request to backend to save the data
  console.log(employees)

  // update SWR cache....??
  mutate("Employee", [...fakeEmployees, ...employees], false);
}
