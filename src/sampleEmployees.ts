import { Employee, Role } from './types/employee';
import { Shift } from './types/schedule'

export let fakeEmployees: Employee[] = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    address: "123 Elm Street",
    dob: new Date(1990, 6, 20),
    gender: "M",
    employmentType: "Full Time",
    wage: 50000,
    role: Role.Manager,
    secondaryRole: Role.Server,
    mon: Shift.Morning,
    tues: Shift.Night,
    wed: Shift.Full,
    thurs: Shift.Morning,
    fri: Shift.Full,
    sat: Shift.Morning,
    sun: Shift.Night
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
    address: "456 Oak Avenue",
    dob: new Date(1985, 7, 15),
    gender: "F",
    employmentType: "Part Time",
    wage: 30000,
    role: Role.Server,
    secondaryRole: Role.Kitchen,
    mon: Shift.Full,
    tues: Shift.Night,
    wed: Shift.Morning,
    thurs: Shift.Full,
    fri: Shift.Morning,
    sat: Shift.Night,
    sun: Shift.Morning
  }
];
