import useSWR from "swr"
import { fetcher } from "../api/swr"

export const useSchedule = () => {
  const { data, isLoading } = useSWR("Schedule", fetcher)
  return { schedule: data || [], isLoading }
}
