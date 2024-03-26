import { Employee } from "./api/employee";

export const fakeEmployees: Employee[] = [
  {
    id: 1,
    name: "Dylan Murray",
    type: "FT", // status
    wage: 800,
    role: "Dishwasher",
    mon: "9am to 10pm",
    tues: "9am to 6pm",
    wed: "9am to 10pm",
    thurs: "4pm to 10pm",
    fri: "9am to 10pm",
    sat: "NA",
    sun: "9am to 10pm",
  },
  {
    id: 2,
    name: "Rachel Stone",
    type: "PT",
    wage: 500,
    role: "Manager",
    mon: "9am to 3pm",
    tues: "NA",
    wed: "9am to 10pm",
    thurs: "12pm to 10pm",
    fri: "9am to 10pm",
    sat: "4pm to 10pm",
    sun: "9am to 10pm",
  },
]
// {
//   id: 1,
//   name: "John Doe",
//   type: "FT",
// },
// {
//   id: 2,
//   name: "Jane Smith",
//   type: "PT",
//   availability: [
//     { day: "Wednesday", start: "13:00", end: "17:00" },
//     { day: "Thursday", start: "13:00", end: "22:00" },
//     { day: "Friday", start: "11:00", end: "17:00" }
//   ]
// },
// {
//   id: 3,
//   name: "Alice Johnson",
//   type: "FT",
// }
// ]