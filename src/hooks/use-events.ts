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

const validateRequired = (event) => !!event.length
const validateNum = (value) => Number.isInteger(Number(value))

// more validate functions

export function validateEvent(event) {
  return {
    eventName: !validateRequired(event.eventName) ? "Event Name is Required" : "",
    eventType: !validateRequired(event.eventType) ? "Event Type is Required" : "",
    eventDate: !validateRequired(event.eventDate) ? "Event Date is Required" : "",
    eventETime: !validateRequired(event.eventSession) ? "Please Choose an Event Session" : "",
    numPax: !validateNum(event.numPax) ? "Please input a number" : "",
    staffReq: !validateNum(event.staffReq) ? "Please input a number" : "",
  }
}
