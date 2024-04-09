import useSWR, { mutate } from "swr"
import { deleteRequest, fetcher, postRequest, putRequest } from "../api"
import { Booking } from "../types/booking"

export const useBookings = () => {
  const { data, isLoading } = useSWR<Booking[]>("/booking", fetcher)
  return { bookings: data || [], isLoading }
}

export const useDeleteBooking = () => {
  return (id: number) =>
    mutate("/booking", async () => await deleteRequest("/booking", id), {
      optimisticData: (prev: Booking[] | undefined) => prev?.filter((b) => b.id !== id) || [],
    })
}

export const useUpdateBooking = () => {
  return (data: Booking) =>
    mutate("/booking", async () => await putRequest("/booking", data.id, data), {
      optimisticData: (prev: Booking[] | undefined) =>
        prev?.map((b) => (b.id === data.id ? data : b)) || [],
    })
}

export const useAddBooking = () => {
  return (data: Booking) =>
    mutate("/booking", async () => await postRequest("/booking", data), false)
}
