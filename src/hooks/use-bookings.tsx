import useSWR from "swr"
import { fetcher } from "../api/swr"
import { useCallback } from "react"
import { deleteBooking, Booking, addBooking } from "../api/booking"

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

export const useAddBooking = () => {
  const { data: bookings, mutate } = useSWR("Booking", fetcher);

  const handleAdd = useCallback(
    async (newBookingData) => {
      if (bookings) {
        // Assuming addBooking is a function that adds a new booking
        const updatedBookings = await addBooking(newBookingData);
        mutate(updatedBookings, false);
      }
    },
    [bookings, mutate]
  );

  return handleAdd;
};



