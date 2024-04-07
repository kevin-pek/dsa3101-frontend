export enum Shift {
  UNAVAILABLE = 0,
  DAY = 1,
  NIGHT = 2,
  BOTH = 3,
}

export enum Role {
  Manager = "Manager",
  Server = "Server",
  Cook = "Cook",
  Dishwasher = "Dishwasher",
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
