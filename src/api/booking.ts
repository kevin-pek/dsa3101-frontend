import { mutate } from "swr";
import { fakeBookings } from "../sampleBookings";

export const getBookings = async () => {
  console.debug("Fetching bookings");
  await new Promise((resolve) => setTimeout(resolve, 3000)); // delay result by 3 seconds
  return fakeBookings;
};

export interface Booking {
  bookingId: number;
  eventName: string;
  eventDate: string;
  eventDay: string;
  eventSTime: string;
  eventETime: string;
  numPax: number;
  staffReq: number;
  remark: string;
}

export const updateBooking = async (updatedBooking: Booking): Promise<Booking[]> => {
  console.debug("Updating booking");
  console.debug(updatedBooking);
  
  await new Promise((resolve) => setTimeout(resolve, 1000)); // delay result by 1 second

  const updatedBookings = fakeBookings.map((booking) =>
    booking.bookingId === updatedBooking.bookingId ? { ...booking, ...updatedBooking } : booking
  );
  
  // Assuming mutate is a function to update some external data source or state
  mutate("bookings", updatedBookings, false); // Use the correct key ("bookings") and pass updatedBookings
  
  return updatedBookings;
};

export const deleteBooking = async (bookingId: number): Promise<void> => {
  console.debug("Deleting booking with ID:", bookingId);
  
  await new Promise((resolve) => setTimeout(resolve,2000)); // delay result by 2 seconds

  const updatedBookings = fakeBookings.filter((booking) => booking.bookingId !== bookingId);

  Object.assign(fakeBookings, updatedBookings);

  // mutate("bookings", updatedBookings, false);
}


// //UPDATE hook (put user in api)
// function useUpdateUser() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (user) => {
//       //send api update request here
//       await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
//       return Promise.resolve();
//     },
//     //client side optimistic update
//     onMutate: (newUserInfo) => {
//       queryClient.setQueryData(['users'], (prevUsers) =>
//         prevUsers?.map((prevUser) =>
//           prevUser.id === newUserInfo.id ? newUserInfo : prevUser,
//         ),
//       );
//     },
//     // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
//   });
// }

// //DELETE hook (delete user in api); i dont know what this func does but it links to API so ill leave it here
// function useDeleteUser() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (bookingId) => {
//       //send api update request here
//       await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
//       return Promise.resolve();
//     },
//     //client side optimistic update
//     onMutate: (userId) => {
//       queryClient.setQueryData(['users'], (prevUsers) =>
//         prevUsers?.filter((user) => user.id !== userId),
//       );
//     },
//   });
// }