import { DoW } from "./constants"

export interface Demand {
  date: string
  time: string
  day: DoW
  predicted: number
  actual?: number
}

export interface PredictedDemand {
  date: string
  time: string
  day: DoW
  customers: number
}

export interface ActualDemand {
  date: string
  time: string
  day: DoW
  customers: number
}