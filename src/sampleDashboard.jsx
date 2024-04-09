export const Employees = [
  { month: 'Jan', Expenditure: 2890, Workers: 139, Hours: 4709 },
  { month: 'Feb', Expenditure: 2700, Workers: 176, Hours: 1017 },
  { month: 'Mar', Expenditure: 3600, Workers: 228, Hours: 376 },
  { month: 'Apr', Expenditure: 2500, Workers: 232, Hours: 6922 },
  { month: 'May', Expenditure: null, Workers: null, Hours: null },
  { month: 'Jun', Expenditure: null, Workers: null, Hours: null },
  { month: 'Jul', Expenditure: null, Workers: null, Hours: null },
  { month: 'Aug', Expenditure: 5000, Workers: null, Hours: null },
  { month: 'Sep', Expenditure: null, Workers: null, Hours: null },
  { month: 'Oct', Expenditure: null, Workers: null, Hours: null },
  { month: 'Nov', Expenditure: null, Workers: null, Hours: null },
  { month: 'Dec', Expenditure: null, Workers: null, Hours: null },
];

export const hoursWorked = [
  { month: 'Jan', Manager: 14434, Chef: 23153, Cashier: 19499},
  { month: 'Feb', Manager: 2192, Chef: 6564, Cashier: 13559},
  { month: 'Mar', Manager: 12205, Chef: 3274, Cashier: 10269},
  { month: 'Apr', Manager: null, Chef: null, Cashier: null},
  { month: 'May', Manager: null, Chef: null, Cashier: null},
  { month: 'Jun', Manager: null, Chef: null, Cashier: null},
  { month: 'Jul', Manager: null, Chef: null, Cashier: null},
  { month: 'Aug', Manager: null, Chef: null, Cashier: null},
  { month: 'Sep', Manager: null, Chef: null, Cashier: null},
  { month: 'Oct', Manager: null, Chef: null, Cashier: null},
  { month: 'Nov', Manager: null, Chef: null, Cashier: null},
  { month: 'Dec', Manager: null, Chef: null, Cashier: null},
]

export const hiringExpenditure = [
  { month: 'Jan', Manager: 2890, Chef: 139, Cashier: 4709, Total: 1500, Weekday: 500, Weekend: 400, PH: 600 },
  { month: 'Feb', Manager: 2700, Chef: 176, Cashier: 1017, Total: 2400, Weekday: 800, Weekend: 900, PH: 700 },
  { month: 'Mar', Manager: 3600, Chef: 228, Cashier: 376, Total: 4500, Weekday: 1500, Weekend: 1200, PH: 1700 },
  { month: 'Apr', Manager: 2500, Chef: 232, Cashier: 6922, Total: 1800, Weekday: 600, Weekend: 200, PH: 400 },
  { month: 'May', Manager: null, Chef: null, Cashier: null, Total: null, Weekday: null, Weekend: null, PH: null },
  { month: 'Jun', Manager: null, Chef: null, Cashier: null, Total: null, Weekday: null, Weekend: null, PH: null },
  { month: 'Jul', Manager: null, Chef: null, Cashier: null, Total: null, Weekday: null, Weekend: null, PH: null },
  { month: 'Aug', Manager: 5000, Chef: null, Cashier: null, Total: null, Weekday: null, Weekend: null, PH: null },
  { month: 'Sep', Manager: null, Chef: null, Cashier: null, Total: null, Weekday: null, Weekend: null, PH: null },
  { month: 'Oct', Manager: null, Chef: null, Cashier: null, Total: null, Weekday: null, Weekend: null, PH: null },
  { month: 'Nov', Manager: null, Chef: null, Cashier: null, Total: null, Weekday: null, Weekend: null, PH: null },
  { month: 'Dec', Manager: null, Chef: null, Cashier: null, Total: null, Weekday: null, Weekend: null, PH: null },
];

export const empAvailability = [
  { day: 'Mon', PartTime: 46, FullTime: 84 },
  { day: 'Tues', PartTime: 29, FullTime: 57 },
  { day: 'Wed', PartTime: 60, FullTime: 98 },
  { day: 'Thurs', PartTime: 47, FullTime: 26 },
  { day: 'Fri', PartTime: 80, FullTime: 95 },
  { day: 'Sat', PartTime: 50, FullTime: 78 },
  { day: 'Sun', PartTime: 50, FullTime: 59 },
];

export const empRoles = [
{month: 'Jan', Manager: 23, Chef: 50, Cashier: 40 },
{month: 'Feb', Manager: 14, Chef: 50, Cashier: 40 },
{month: 'Mar', Manager: 20, Chef: 50, Cashier: 40 },
{month: 'Apr', Manager: 22, Chef: 50, Cashier: 40 },
{month: 'May', Manager: 13, Chef: 50, Cashier: 40 },
{month: 'Jun', Manager: 47, Chef: 50, Cashier: 40 },
{month: 'Jul', Manager: 36, Chef: 50, Cashier: 40 },
{month: 'Aug', Manager: 23, Chef: 50, Cashier: 40 },
{month: 'Sep', Manager: 23, Chef: 50, Cashier: 40 },
{month: 'Oct', Manager: 23, Chef: 50, Cashier: 40 },
{month: 'Nov', Manager: 23, Chef: 50, Cashier: 40 },
{month: 'Dec', Manager: 23, Chef: 50, Cashier: 40 },
]

export const weeklyBookings = [
{ day: 'Mon', Bookings: 46 },
{ day: 'Tues', Bookings: 29 },
{ day: 'Wed', Bookings: 60 },
{ day: 'Thurs', Bookings: 47 },
{ day: 'Fri', Bookings: 108 },
{ day: 'Sat', Bookings: 300 },
{ day: 'Sun', Bookings: 250 },
];

export const monthlyBookings = [
  { month: 'Jan', Bookings: 46 },
  { month: 'Feb', Bookings: 29 },
  { month: 'Mar', Bookings: 60 },
  { month: 'Apr', Bookings: 47 },
  { month: 'May', Bookings: null },
  { month: 'Jun', Bookings: null },
  { month: 'Aug', Bookings: null },
  { month: 'Sep', Bookings: null },
  { month: 'Oct', Bookings: null },
  { month: 'Nov', Bookings: null },
  { month: 'Dec', Bookings: null },
];

//displays customer demand forecast for the entire month
export const demandForecast = [
  { date: '1 Apr', Customers: 7350 },
  { date: '2 Apr', Customers: 9245 },
  { date: '3 Apr', Customers: 5185 },
  { date: '4 Apr', Customers: 8782 },
  { date: '5 Apr', Customers: 4457 },
  { date: '6 Apr', Customers: 4326 },
  { date: '7 Apr', Customers: 7847 },
  { date: '8 Apr', Customers: 6427 },
  { date: '9 Apr', Customers: 4068 },
  { date: '10 Apr', Customers: 5461 },
  { date: '11 Apr', Customers: 2735 },
  { date: '12 Apr', Customers: 6093 },
  { date: '13 Apr', Customers: 8815 },
  { date: '14 Apr', Customers: 6881 },
  { date: '15 Apr', Customers: 9658 },
  { date: '16 Apr', Customers: 6549 },
  { date: '17 Apr', Customers: 9263 },
  { date: '18 Apr', Customers: 3757 },
  { date: '19 Apr', Customers: 9451 },
  { date: '20 Apr', Customers: 5029 },
  { date: '21 Apr', Customers: 8932 },
  { date: '22 Apr', Customers: 7586 },
  { date: '23 Apr', Customers: 3707 },
  { date: '24 Apr', Customers: 5676 },
  { date: '25 Apr', Customers: 2214 },
  { date: '26 Apr', Customers: 9554 },
  { date: '27 Apr', Customers: 2594 },
  { date: '28 Apr', Customers: 6402 },
  { date: '29 Apr', Customers: 6940 },
  { date: '30 Apr', Customers: 7836 },
];