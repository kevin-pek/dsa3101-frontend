import useSWR, { mutate } from "swr"
import { fetcher, postRequest } from "../api"
import { ActualDemand, Demand, PredictedDemand } from "../types/demand"

export const useDemand = () => {
  const { data, isLoading } = useSWR<Demand[]>("/demand", fetcher)
  return { demand: data || [], isLoading }
}

export const useAddActualDemand = () => {
  return (data: Omit<Demand, "predicted">) =>
    mutate("/demand", async () => await postRequest("/demand", data), false)
} 

export const usePastDemand = () => {
  const { data, isLoading } = useSWR<ActualDemand[]>("/get_past_demand", fetcher)
  return { demand: data || [], isLoading }
}

export const usePredictedDemand = () => {
  const { data, isLoading } = useSWR<PredictedDemand[]>("/get_demand_forecast", fetcher)
  return { demand: data || [], isLoading }
}

