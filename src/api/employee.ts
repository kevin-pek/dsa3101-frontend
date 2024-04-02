import { mutate } from "swr"
import { fakeEmployees } from "../sampleEmployees"
import useSWR from "swr"

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

export const updateEmployee = async (updatedEmployee: Employee, currentEmployees: Employee[]): Promise<Employee[]> => {
  console.debug("Updating employee") 

  await new Promise((resolve) => setTimeout(resolve, 1000)) // delay result by 1 second
  const updatedEmployees = currentEmployees.map((employee) =>
    employee.id === updatedEmployee.id ? { ...employee, ...updatedEmployee } : employee
  )
  
  return updatedEmployees
}

export const deleteEmployee = async (employeeId: number, currentEmployees: Employee[]): Promise<Employee[]> => {
  console.debug("Deleting employee with ID:", employeeId);

  await new Promise((resolve) => setTimeout(resolve, 1000)); // delay result by 1 second
  const updatedEmployees = currentEmployees.filter(employee => employee.id !== employeeId);

  return updatedEmployees;
}
