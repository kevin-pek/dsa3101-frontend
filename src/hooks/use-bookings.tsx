import useSWR from "swr"
import { fetcher } from "../api/swr"
import { useCallback } from "react"
import { deleteBooking } from "../api/booking"
import { Booking } from "../api/booking"

export const useBookings = () => {
  const { data, isLoading } = useSWR<Booking[]>("Booking", fetcher)
  return { bookings: data || [], isLoading }
}

export const useDeleteBooking = () => {
  const { data: bookings, mutate } = useSWR("Booking", fetcher);

  const handleDelete = useCallback(
    async (bookingId: number) => {
      if (bookings) {
        // Assuming deleteBooking is a function that takes bookingId and bookings
        const updatedBookings = await deleteBooking(bookingId, bookings);

        mutate(updatedBookings, false);
      }
    },
    [bookings, mutate]
  );

  return handleDelete;
};
