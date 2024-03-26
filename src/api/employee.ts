import { mutate } from "swr"
import { fakeEmployees } from "../sampleEmployees"

export interface Employee {
  id: number
  name: string
  type: "FT" | "PT"
  wage: number;
  role: "Manager" | "Server" | "Cook" | "Dishwasher";
  mon: string;
  tues: string;
  wed: string;
  thurs: string;
  fri: string;
  sat: string;
  sun: string;
}

export const getEmployees = async (): Promise<Employee[]> => {
  console.debug("Fetching employees")
  await new Promise((resolve) => setTimeout(resolve, 1000)) // delay result by 3 seconds
  return fakeEmployees
};

export const updateEmployee = async (updatedEmployee: Employee): Promise<Employee[]> => {
  console.debug("Updating employee") 
  console.debug(updatedEmployee)
  await new Promise((resolve) => setTimeout(resolve, 1000)) // delay result by 3 seconds
  const updatedEmployees = fakeEmployees.map((employee) =>
    employee.id === updatedEmployee.id ? { ...employee, ...updatedEmployee } : employee
  )
  mutate("Employee", updatedEmployees, false)
  Object.assign(fakeEmployees, updatedEmployees)

  return updatedEmployees
}