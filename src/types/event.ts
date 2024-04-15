import { ESession, EType } from "./constants"

export interface Event {
  id: number
  eventName: string
  eventType: EType
  eventDate: string
  eventSession: ESession
  numPax: number
  staffReq: number
  remark: string
}
