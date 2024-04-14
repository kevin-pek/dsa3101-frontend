import useSWR, { mutate } from "swr"
import { deleteRequest, fetcher, postRequest, putRequest } from "../api"
import { Event } from "../types/event"

export const useBookings = () => {
  const { data, isLoading } = useSWR<Event[]>("/event", fetcher)
  return { bookings: data || [], isLoading }
}

export const useDeleteBooking = () => {
  return (id: number) =>
    mutate("/event", async () => await deleteRequest("/event", id), {
      optimisticData: (prev: Event[] | undefined) => prev?.filter((b) => b.id !== id) || [],
    })
}

export const useUpdateBooking = () => {
  return (data: Event) =>
    mutate("/event", async () => await putRequest("/event", data.id, data), {
      optimisticData: (prev: Event[] | undefined) =>
        prev?.map((b) => (b.id === data.id ? data : b)) || [],
    })
}

export const useAddBooking = () => {
  return (data: Event) => mutate("/event", async () => await postRequest("/event", data), false)
}
