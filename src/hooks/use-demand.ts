import useSWR, { mutate } from "swr"
import { fetcher, postRequest } from "../api"
import { Demand } from "../types/demand"

export const useDemand = () => {
  const { data, isLoading } = useSWR<Demand[]>("/demand", fetcher)
  return { demand: data || [], isLoading }
}

export const useAddActualDemand = () => {
  return (data: Omit<Demand, 'predicted'>) => mutate("/demand", async () => await postRequest("/demand", data), false)
}