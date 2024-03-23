import useSWR from "swr"
import { fetcher } from "../api/swr"

export const useEmployees = () => {
  const { data, isLoading } = useSWR("Employee", fetcher)
  return { employees: data || [], isLoading }
}
