export const getBookings = async () => {
  console.debug("Fetching employees")
  await new Promise((resolve) => setTimeout(resolve, 3000)) // delay result by 3 seconds
  return [{ id: 1, date: new Date(), start: "1900", end: "2100" }]
}
