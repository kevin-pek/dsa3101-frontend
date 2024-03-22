import useSWR from "swr"
import { fetcher } from "../api/swr"

export const useEmployees = () => {
  const { data, isLoading } = useSWR("Booking", fetcher)
  return { bookings: data || [], isLoading }
}
