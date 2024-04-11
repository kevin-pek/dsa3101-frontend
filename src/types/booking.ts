import { DoW } from "./constants"

export interface Booking {
  id: number
  eventName: string
  eventDate: string
  eventDay: DoW
  eventSTime: string
  eventETime: string
  numPax: number
  staffReq: number
  remark: string
}
