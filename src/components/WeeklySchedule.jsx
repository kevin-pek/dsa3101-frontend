import { Grid, Text, Box, Paper } from "@mantine/core"

export const WeeklySchedule = ({ schedule }) => {
  const timeToGridRow = (time) => {
    const hours = parseInt(time.substring(0, 2), 10)
    const minutes = parseInt(time.substring(2), 10)
    return hours * 2 + (minutes >= 30 ? 1 : 0) + 1 // +1 because CSS grid rows start at 1
  }

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]

  return (
    <Grid>
      {daysOfWeek.map((day) => (
        <Grid.Col span={1} key={day}>
          <Paper padding="md" shadow="xs">
            <Text size="sm" weight={500}>
              {day}
            </Text>
            <Box sx={{ height: "100%", position: "relative" }}>
              {/* Filter shifts for this day and map them */}
              {schedule
                .filter((shift) => shift.day === day)
                .map((shift) => (
                  <Paper
                    key={shift.employee}
                    shadow="xs"
                    padding="xs"
                    style={{
                      position: "absolute",
                      top: `${(timeToGridRow(shift.start) - 16) * 12.5}%`, // starting row
                      height: `${(timeToGridRow(shift.end) - timeToGridRow(shift.start)) * 12.5}%`, // duration of the shift
                      left: "10%",
                      right: "10%",
                      backgroundColor: "#f3f3f3",
                    }}
                  >
                    <Text size="xs">
                      {shift.name} ({shift.role})
                    </Text>
                    <Text size="xs">
                      {shift.start} - {shift.end}
                    </Text>
                  </Paper>
                ))}
            </Box>
          </Paper>
        </Grid.Col>
      ))}
    </Grid>
  )
}
