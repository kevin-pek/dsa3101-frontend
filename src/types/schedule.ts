import { DoW } from "./constants"
import { Role } from "./employee"

export enum Shift {
  Morning = "Morning",
  Night = "Night",
  Full = "Full",
  None = "None",
}

export interface Schedule {
  id: number
  employeeId: number
  start: string // 24-hour start/end times are used for manual overriding of shift schedule
  end: string
  shift: Shift
  day: DoW
  role: Role
  week: string // make sure this corresponds to date from mantine's getStartOfWeek function
}

export interface ScheduleParameters {
  maxHrFT: number
  maxHrPT: number
}
