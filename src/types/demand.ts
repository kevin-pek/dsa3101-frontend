import { DoW } from "./constants"

export interface Demand {
  date: string
  time: string
  day: DoW
  predicted: number
  actual?: number
}