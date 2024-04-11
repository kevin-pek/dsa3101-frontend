import { Employee } from "./api/employee"

export let fakeEmployees: Employee[] = [
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
