import React, { useEffect } from "react"
import { LineChart, BarChart, AreaChart, RadarChart } from "@mantine/charts"
import { Text, Grid, Paper, Group, Container, Title, Select } from "@mantine/core"
import {
  empAvailability,
  hiringExpenditure,
  empRoles,
  hoursWorked,
  weeklyBookings,
  monthlyBookings,
  demand,
} from "../sampleDashboard.jsx"
import InputDemandForm from "../components/dashboard/InputDemandForm.jsx"
import { useState } from "react"
import "@mantine/charts/styles.css"
import { DatePickerInput, MonthPickerInput } from "@mantine/dates"
import {
  getPastFourteenDays,
  getPastTwelveMonths,
  getSevenDaysBeforeAndAfter,
} from "../utils/time.js"
import { useMediaQuery } from "@mantine/hooks"
import { useDemand } from "../hooks/use-demand"

enum DateInterval {
  Daily = "Daily",
  Monthly = "Monthly",
}

function formatDate(date) {
  const day = date.getDate() // Get the day of the month
  const monthIndex = date.getMonth() // Get the month index (0-based)
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  const month = monthNames[monthIndex] // Get the month name from the array
  return `${day} ${month}` // Return the formatted string
}

export function Dashboard() {
  const { demand } = useDemand()
  const [view, setView] = useState<DateInterval>(DateInterval.Daily)
  // timeRange will either be month range or day range depending on selectedView
  // @ts-ignore
  const [timeRange, setTimeRange] = useState<[Date | null, Date | null]>()

  const isMobile = useMediaQuery("(max-width: 50em)")

  useEffect(() => {
    // @ts-ignore
    if (view === DateInterval.Monthly) setTimeRange(getPastTwelveMonths())
    // @ts-ignore
    else if (view === DateInterval.Daily) setTimeRange(getPastFourteenDays())
  }, [view])

  // TODO: useMemos for demand, cost and upcoming events

  return (
    <Container fluid p="md">
      <Grid>
        <Grid.Col span={6}>
          <Title order={2}>Dashboard</Title>
        </Grid.Col>
        <Grid.Col span={3}>
          <Select
            value={view}
            onChange={(val) => setView(val as DateInterval)}
            data={Object.values(DateInterval)}
            label="Current Selected View"
            placeholder="Select option"
            width={200}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          {view === DateInterval.Daily ? (
            <DatePickerInput
              label="Pick Date Range"
              type="range"
              value={timeRange}
              onChange={setTimeRange}
            />
          ) : (
            <MonthPickerInput
              label="Pick Month Range"
              type="range"
              value={timeRange}
              onChange={setTimeRange}
            />
          )}
        </Grid.Col>

        <Grid.Col span={9}>
          <Paper withBorder p="md">
            <Title order={4} p="md">
              Number of Customers:
            </Title>
            <Text pl="md">
              Number of customers and the predicted numbers, up until the next 7 days.
            </Text>
            <LineChart
              h={300}
              data={demand}
              dataKey="date"
              series={[
                { name: "predicted", label: "Forecasted", color: "orange.6" },
                { name: "actual", label: "Actual", color: "teal.6" },
              ]}
              curveType="linear"
              tickLine="xy"
              gridAxis="y"
              connectNulls={false}
              withLegend
              referenceLines={[{ x: formatDate(new Date()), label: "Today", color: "red" }]}
            />
          </Paper>
        </Grid.Col>
        <Grid.Col span={3} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <InputDemandForm />
        </Grid.Col>

        <Grid.Col span={6}>
          <Paper withBorder p="md">
            <Title order={4} mb="md" p="md">
              Total Manpower Expenditure:
            </Title>
            <Text pl="md">
              Shows number of customers and the predicted customers for the next 7 days.
            </Text>
            {/* TODO: Add expenditure breakdown by role filter */}
            <LineChart
              h={300}
              data={hiringExpenditure}
              dataKey="month"
              series={[{ name: "Total", color: "rgb(47, 173, 102)" }]}
              curveType="linear"
              tickLine="xy"
              connectNulls={false}
              withLegend
            />
          </Paper>
        </Grid.Col>

        <Grid.Col span={6}>
          <Paper withBorder p="md">
            <Title order={4}p="md">
              Upcoming Events:
            </Title>
            <Text pl="md">
              Number of upcoming events.
            </Text>
            <LineChart
              h={300}
              data={monthlyBookings}
              dataKey="month"
              series={[{ name: "Bookings", color: "rgb(47, 173, 102)" }]}
              curveType="linear"
              tickLine="xy"
              connectNulls={false}
              withLegend
            />
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  )
}
