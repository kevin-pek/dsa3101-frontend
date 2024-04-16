import { ESession } from "./constants"

export interface Event {
  id: number
  eventName: string
  eventDate: string
  eventSession: ESession
  numPax: number
  staffReq: number
  remark: string
}
