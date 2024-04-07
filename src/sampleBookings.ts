import { Booking } from "./api/booking";

export let fakeBookings: Booking[] = [
  {
    bookingId: 1,
    eventName: "Event 1",
    eventDate: "2024-01-01",
    eventDay: "Monday",
    eventSTime: "12:00",
    eventETime: "14:00",
    numPax: 20,
    staffReq: 5,
    remark: "Just one chef",
  },
  {
    bookingId: 2,
    eventName: "Event 2",
    eventDate: "2024-01-02",
    eventDay: "Tuesday",
    eventSTime: "15:00",
    eventETime: "17:00",
    numPax: 5,
    staffReq: 2,
    remark: "NIL",
  },
  {
    bookingId: 3,
    eventName: "To test delete 1",
    eventDate: "2025-03-14",
    eventDay: "Friday",
    eventSTime: "19:00",
    eventETime: "20:00",
    numPax: 10,
    staffReq: 4,
    remark: "NIL",
  },
  {
    bookingId: 4,
    eventName: "To test delete 2",
    eventDate: "2025-03-14",
    eventDay: "Thursday",
    eventSTime: "10:00",
    eventETime: "12:00",
    numPax: 3,
    staffReq: 1,
    remark: "NIL",
  },
]
  