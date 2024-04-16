import { Shift } from "./schedule"

export enum Role {
  Manager = "Manager",
  Service = "Service",
  Kitchen = "Kitchen",
}

export interface Employee {
  id: number
  email: string
  name: string
  address: string
  dob: Date
  gender: "M" | "F"
  employmentType: "Full Time" | "Part Time"
  wage: number
  role: Role
  secondaryRole: Role
  mon: Shift
  tues: Shift
  wed: Shift
  thurs: Shift
  fri: Shift
  sat: Shift
  sun: Shift
}
