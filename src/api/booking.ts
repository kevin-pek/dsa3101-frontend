import { mutate } from "swr";
import { fakeBookings } from "../sampleBookings";

export interface Booking {
  bookingId: number;
  eventName: string;
  eventDate: string;
  eventDay: "Monday" |'Tuesday'|'Wednesday'|'Thursday'|'Friday'|'Saturday'|'Sunday' ;
  eventSTime: string;
  eventETime: string;
  numPax: number;
  staffReq: number;
  remark: string;
}

export const getBookings = async (): Promise<Booking[]> => {
  console.debug("Fetching bookings");
  await new Promise((resolve) => setTimeout(resolve, 3000)); // delay result by 3 seconds
  return fakeBookings;
};

export const updateBooking = async (updatedBooking: Booking): Promise<Booking[]> => {
  console.debug("Updating booking");
  
  await new Promise((resolve) => setTimeout(resolve, 1000)); // delay result by 1 second

  const updatedBookings = fakeBookings.map((booking) =>
    booking.bookingId === updatedBooking.bookingId ? { ...booking, ...updatedBooking } : booking
  );
  
  mutate("Booking", updatedBookings); // Use the correct key ("bookings") and pass updatedBookings
  Object.assign(fakeBookings,updatedBookings)
  
  return updatedBookings;
};

export const deleteBooking = async (
  bookingId: number
): Promise<Booking[]> => {
  console.debug("Deleting booking with ID:", bookingId)

  await new Promise((resolve) => setTimeout(resolve, 1000)) // delay result by 1 second
  const updatedBookings = fakeBookings.filter((booking) => booking.bookingId !== bookingId)
  mutate("Booking", updatedBookings)
  Object.assign(fakeBookings, updatedBookings)
  return updatedBookings
}

// export const saveBookingData = async(bookings: Booking[]):
// Promise<void> => {
//   console.log("Saving data for bookings", bookings.length)

//   console.log(bookings)

//   mutate("Bookings");
// }

export const addBooking = async (newBooking: Booking): Promise<Booking[]> => {
  console.debug("Adding new booking");
  console.debug(newBooking);
  
  await new Promise((resolve) => setTimeout(resolve, 2000)); // delay result by 2 seconds

  // Find the maximum bookingId in the existing bookings
  const maxBookingId = Math.max(...fakeBookings.map((booking) => booking.bookingId));

  // Generate a new bookingId by adding 1 to the maximum bookingId
  const newBookingId = maxBookingId + 1;

  // Add the new booking with the generated bookingId
  const updatedBookings = [...fakeBookings, { ...newBooking, bookingId: newBookingId }];
  // fakeBookings.push(updatedBookings);

  mutate("bookings", updatedBookings, false); // Use the correct key ("bookings") and pass updatedBookings
  Object.assign(fakeBookings,updatedBookings)
  
  return updatedBookings;
};