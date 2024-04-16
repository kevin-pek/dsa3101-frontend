import { Shift } from "./schedule"

export enum Role {
  Manager = "Manager",
  Service = "Service",
  Kitchen = "Kitchen",
}

export enum dayType {
  Weekday = "Weekday",
  Weekend = "Weekend",
  PH = "PH",
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

export interface Wage {
  day: dayType,
  role: Role,
  wage: number,
}