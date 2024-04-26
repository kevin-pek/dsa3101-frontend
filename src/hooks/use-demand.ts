import { mutate } from "swr"
import { postRequest } from "../api"
import { Demand } from "../types/demand"

export const useAddActualDemand = () => {
  return (data: Omit<Demand, "predicted">) =>
    mutate("/demand", async () => await postRequest("/post_demand_forecast", data), false)
} 
