import React, { useEffect } from "react"
import { LineChart, BarChart, AreaChart, RadarChart } from "@mantine/charts"
import { Text, Grid, Paper, Group, Container, Title, Select, Stack, Space, List, ListItem, ColorSwatch } from "@mantine/core"
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
import { IconArrowDownRight, IconArrowUpRight, IconCoin, IconUsers } from "@tabler/icons-react"

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

  const cost = 1000
  const diff = -10
  const DiffIcon = diff > 0 ? IconArrowUpRight : IconArrowDownRight

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

        <Grid.Col span={6} style={{ alignItems: "stretch" }}>
          <Paper withBorder p="md" h="100%">
            <Title order={4} p="md">
              Today's Forecast (Hourly):
            </Title>
            <BarChart
              h={300}
              data={demand}
              dataKey="date"
              series={[
                { name: "predicted", label: "Forecasted", color: "orange.6" },
              ]}
              tickLine="xy"
              gridAxis="y"
            />
          </Paper>
        </Grid.Col>

        <Grid.Col span={3}>
          <Stack gap="xl" h="100%" justify="space-between">
            <InputDemandForm />

            <Paper
              withBorder
              p="md"
            >
              <Group justify="space-between">
                <Text size="md" c="dimmed" fw={700}>
                  Manpower Cost
                </Text>
                <IconCoin size="1.4rem" stroke={1.5} />
              </Group>
              <Group align="flex-end" gap="xs" mt={25}>
                <Text size="lg">{cost}</Text>
                <Text c={diff > 0 ? "teal" : "red"} fz="sm" fw={500}>
                  <span>{diff}%</span>
                  <DiffIcon size="1rem" stroke={1.5} />
                </Text>
              </Group>
              <Text c="dimmed">compared to last {view === DateInterval.Daily ? "week" : "month"}.</Text>
            </Paper>
          </Stack>
        </Grid.Col>

        <Grid.Col span={3}>
          <Stack h="100%" justify="space-between">
            <Paper withBorder p="md" radius="md">
              <Title order={5} c="dimmed">
                No. Employees by Role
              </Title>
              <Space h="sm" />
              <List
                withPadding
                center
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <ListItem
                  component="span"
                  icon={<ColorSwatch size="1em" color="var(--mantine-color-violet-light-color)" />}
                >
                  Manager
                </ListItem>
                <ListItem
                  component="span"
                  icon={<ColorSwatch size="1em" color="var(--mantine-color-orange-light-color)" />}
                >
                  Kitchen
                </ListItem>
                <ListItem
                  component="span"
                  icon={<ColorSwatch size="1em" color="var(--mantine-color-green-light-color)" />}
                >
                  Server
                </ListItem>
              </List>
            </Paper>

            <Paper withBorder p="md" radius="md">
              <Title order={5} c="dimmed">
                No. Employees by Type
              </Title>
              <Space h="sm" />
              <List
                withPadding
                center
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <ListItem
                  component="span"
                  icon={<ColorSwatch size="1em" color="var(--mantine-color-orange-light-color)" />}
                >
                  Part Time
                </ListItem>
                <ListItem
                  component="span"
                  icon={<ColorSwatch size="1em" color="var(--mantine-color-green-light-color)" />}
                >
                  Full Time
                </ListItem>
              </List>
            </Paper>

            <Paper
              withBorder
              p="md"
            >
              <Group justify="space-between">
                <Text size="md" c="dimmed" fw={700}>
                  No. of Customers
                </Text>
                <IconUsers size="1.4rem" stroke={1.5} />
              </Group>
              <Group align="flex-end" gap="xs" mt={25}>
                <Text size="lg">{cost}</Text>
                <Text c={diff > 0 ? "teal" : "red"} fz="sm" fw={500}>
                  <span>{diff}%</span>
                  <DiffIcon size="1rem" stroke={1.5} />
                </Text>
              </Group>
              <Text c="dimmed">compared to last {view === DateInterval.Daily ? "week" : "month"}.</Text>
            </Paper>
          </Stack>
        </Grid.Col>

        <Grid.Col span={6}>
          <Paper withBorder p="md" h="100%">
            <Title order={4} mb="md" p="md">
              Total Manpower Expenditure:
            </Title>
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
          <Paper withBorder p="md" h="100%">
            <Title order={4}p="md">
              Upcoming Events:
            </Title>
            <Text pl="md">
              Number of upcoming events.
            </Text>
            <BarChart
              h={300}
              data={monthlyBookings}
              dataKey="month"
              series={[{ name: "Bookings", color: "rgb(47, 173, 102)" }]}
              tickLine="xy"
              withLegend
            />
          </Paper>
        </Grid.Col>


        <Grid.Col span={12}>
          <Paper withBorder p="md">
            <Title order={4} p="md">
              Number of Customers:
            </Title>
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
      </Grid>
    </Container>
  )
}
