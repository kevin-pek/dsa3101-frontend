import { DoW } from "./constants"
import { Role, Shift } from "./employee"

export interface Schedule {
  id: number
  employeeId: number
  start: string // 24-hour start/end times are used for manual overriding of shift schedule
  end: string
  shift: Shift
  day: DoW
  role: Role
}
