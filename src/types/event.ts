import { DoW, EType } from "./constants"

export interface Event {
  id: number
  eventName: string
  eventType: EType
  eventDate: string
  eventDay: DoW
  eventSTime: string
  eventETime: string
  numPax: number
  staffReq: number
  remark: string
}
