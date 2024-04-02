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

export const parseEmployeesFile = async (file: File): Promise<Employee[]> => {
  // logic to parse the CSV file and convert it to an array of Employee objects
  console.log("Parsing file...", file.name);
  // if the parse function returns an array of Employee objects
  // return parse(file.text(), { headers: true });

  // For demonstration, return an empty array
  return [];
};

export const saveEmployeesData = async (employees: Employee[]): Promise<void> => {
  console.log("Saving data for employees", employees.length);

  // send a request to backend to save the data
  console.log(employees);

  // update SWR cache....??
  // mutate("Employee", [...fakeEmployees, ...employees], false);
};
