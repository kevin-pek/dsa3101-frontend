import React, { useEffect, useMemo } from "react"
import { LineChart, BarChart } from "@mantine/charts"
import {
  Text,
  Grid,
  Paper,
  Group,
  Container,
  Title,
  Select,
  Stack,
  Space,
  List,
  ListItem,
  LoadingOverlay,
} from "@mantine/core"
import { hiringExpenditure } from "../sampleDashboard.jsx"
import InputDemandForm from "../components/dashboard/InputDemandForm"
import { useState } from "react"
import "@mantine/charts/styles.css"
import { DatePickerInput, MonthPickerInput } from "@mantine/dates"
import {
  getPastFourteenDays,
  getPastTwelveMonths,
  getSevenDaysAfter,
  getSevenDaysBeforeAndAfter,
  timeStringToString,
} from "../utils/time.js"
import { useMediaQuery } from "@mantine/hooks"
import { IconArrowDownRight, IconArrowUpRight, IconCoin, IconUsers } from "@tabler/icons-react"
import useSWR from "swr"
import { fetcher } from "../api/index"
import { ActualDemand, Demand, PredictedDemand } from "../types/demand"
import { Employee, Role } from "./Employees.jsx"
import dayjs from "dayjs"
import { Event } from "../types/event"

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
  const { data: actualDemand, isLoading: isDemandLoading } = useSWR<ActualDemand[]>(
    "/get_past_demand",
    fetcher,
  )
  const { data: predictedDemand, isLoading: isForecastLoading } = useSWR<PredictedDemand[]>(
    "/get_demand_forecast",
    fetcher,
  )
  const { data: employees, isLoading: isEmployeesLoading } = useSWR<Employee[]>(
    "/employee",
    fetcher,
  )
  const { data: events, isLoading: isEventsLoading } = useSWR<Event[]>("/event", fetcher)

  const mergedDemand = useMemo(() => {
    if (isForecastLoading || isDemandLoading) return []
    const map = new Map<string, Demand>()
    predictedDemand.forEach((d) => {
      const date = new Date(d.date)
      const key = `${dayjs(date).format("D MMM")} ${d.time}`
      map.set(key, { date: d.date, day: d.day, time: d.time, predicted: d.customers })
    })
    actualDemand.forEach((d) => {
      const date = new Date(d.date)
      const key = `${dayjs(date).format("D MMM")} ${d.time}`
      const demand = map.get(key)
      if (demand)
        map.set(key, { ...demand, date: d.date, day: d.day, time: d.time, actual: d.customers })
      else map.set(key, { date: d.date, day: d.day, time: d.time, actual: d.customers })
    })
    return Array.from(map.values())
  }, [actualDemand, predictedDemand])

  const hourlyDemand = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const todayDemand = mergedDemand.filter((d) => d.date === today)
    return todayDemand.reduce((acc, curr) => {
      if (curr.predicted)
        acc.push({ hour: timeStringToString(curr.time.slice(0, 5)), predicted: curr.predicted })
      return acc
    }, [])
  }, [mergedDemand])

  const empByType = useMemo(() => {
    if (isEmployeesLoading) return []
    return employees?.reduce(
      (acc, curr) => {
        if (!acc[curr.employmentType]) acc[curr.employmentType] = 1
        else acc[curr.employmentType] += 1
        return acc
      },
      {} as Record<"Full Time" | "Part Time", number>,
    )
  }, [employees])
  const empByRole = useMemo(() => {
    if (isEmployeesLoading) return []
    return employees?.reduce(
      (acc, curr) => {
        if (!acc[curr.role]) acc[curr.role] = 1
        else acc[curr.role] += 1
        return acc
      },
      {} as Record<Role, number>,
    )
  }, [employees])

  const [view, setView] = useState<DateInterval>(DateInterval.Daily)
  // timeRange will either be month range or day range depending on selectedView
  // @ts-ignore
  const [timeRange, setTimeRange] = useState<[Date | null, Date | null]>()

  const isMobile = useMediaQuery("(max-width: 50em)")

  // filter demand data by current time range and view
  const filteredDemand = useMemo(() => {
    if (!timeRange) return []
    return mergedDemand?.filter(
      (d) => {
        const date = dayjs(d.date)
        return (date.isAfter(timeRange[0]) || date.isSame(timeRange[0], view === DateInterval.Daily ? "day" : "month")) &&
          (date.isBefore(timeRange[1]) || date.isSame(timeRange[1], view === DateInterval.Daily ? "day" : "month"))
      }
    )
  }, [mergedDemand, timeRange])
  // calculate data to display on demand charts
  const demand = useMemo(() => {
    if (view === DateInterval.Daily) {
      const data = filteredDemand?.reduce((acc, curr) => {
        const dateStr = dayjs(curr.date).format("D MMM")
        const entry = acc.get(curr.date)
        if (entry) {
          if (!entry.actual && curr.actual) {
            entry.actual = 0
            entry.actual += curr.actual || 0
          }
          if (!entry.predicted && curr.predicted) {
            entry.predicted = 0
            entry.predicted += curr.predicted || 0
          }
        } else {
          acc.set(curr.date, { date: dateStr, actual: curr.actual, predicted: curr.predicted })
        }
        return acc
      }, new Map<string, Omit<Demand, "time" | "day">>())
      return Array.from(data)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map((v) => v[1])
    } else if (view === DateInterval.Monthly) {
      const data = filteredDemand?.reduce((acc, curr) => {
        const dateStr = dayjs(curr.date).format("MMM YY")
        const month = curr.date.slice(0, 7)
        const entry = acc.get(month)
        if (entry) {
          if (!entry.actual && curr.actual) {
            entry.actual = 0
            entry.actual += curr.actual || 0
          }
          if (!entry.predicted && curr.predicted) {
            entry.predicted = 0
            entry.predicted += curr.predicted || 0
          }
        } else {
          acc.set(month, {
            date: dateStr,
            actual: curr.actual || 0,
            predicted: curr.predicted || 0,
          })
        }
        return acc
      }, new Map<string, Omit<Demand, "time" | "day">>())
      return Array.from(data)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map((v) => v[1])
    }
  }, [filteredDemand])

  // event data filtered into the chosen time range by the user
  const filteredEvents = useMemo(() => {
    if (isEventsLoading || !timeRange) return []
    return events?.filter(
      (e) => {
        const date = dayjs(e.eventDate)
        return (date.isAfter(timeRange[0]) || date.isSame(timeRange[0]), view === DateInterval.Daily ? "day" : "month") &&
          (date.isBefore(timeRange[1]) || date.isSame(timeRange[1], view === DateInterval.Daily ? "day" : "month"))
      }
    )
  }, [events, timeRange])
  // filtered event data that is aggregated into daily basis
  const groupedEvents = useMemo(() => {
    let data: Map<string, { date: string; numPax: number; staffReq: number; count: number }>
    if (view === DateInterval.Daily) {
      data = filteredEvents?.reduce((acc, event) => {
        const dateStr = dayjs(event.eventDate).format("D MMM")
        const entry = acc.get(dateStr)
        if (entry) {
          entry.numPax += event.numPax
          entry.staffReq += event.staffReq
          entry.count += 1 // Count the number of events
        } else {
          acc.set(dateStr, {
            date: dateStr,
            numPax: event.numPax,
            staffReq: event.staffReq,
            count: 1,
          })
        }
        return acc
      }, new Map<string, { date: string; numPax: number; staffReq: number; count: number }>())
    } else if (view === DateInterval.Monthly) {
      data = filteredEvents?.reduce((acc, event) => {
        const dateStr = dayjs(event.eventDate).format("MMM YY")
        const entry = acc.get(dateStr)
        if (entry) {
          entry.numPax += event.numPax
          entry.staffReq += event.staffReq
          entry.count += 1 // Count the number of events
        } else {
          acc.set(dateStr, {
            date: dateStr,
            numPax: event.numPax,
            staffReq: event.staffReq,
            count: 1,
          })
        }
        return acc
      }, new Map<string, { date: string; numPax: number; staffReq: number; count: number }>())
    }
    return Array.from(data)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map((v) => v[1])
  }, [filteredEvents])
  // data for bar chart showing number of events
  const upcomingEventData = useMemo(() => {
    if (!timeRange) return []
    const start = dayjs(timeRange[0])
    const end = dayjs(timeRange[1])
    const res = []
    let curr = start
    if (view === DateInterval.Daily) {
      while (curr.isBefore(end) || curr.isSame(end, "day")) {
        const dateStr = curr.format("D MMM")
        res.push({ date: dateStr, count: groupedEvents.find((e) => e.date === dateStr)?.count ?? 0 })
        curr = curr.add(1, "day")
      }
    } else {
      while (curr.isBefore(end) || curr.isSame(end, "month")) {
        const dateStr = curr.format("MMM YY")
        res.push({ date: dateStr, count: groupedEvents.find((e) => e.date === dateStr)?.count ?? 0 })
        curr = curr.add(1, "month")
      }
    }
    return res
  }, [groupedEvents, timeRange])

  // returns array [diff, pct diff] for walk-in traffic
  const demandDiff = useMemo(() => {
    const [start, end] = getPastFourteenDays().map(dayjs)
    const mid = dayjs(getSevenDaysBeforeAndAfter()[0])
    let curr = start
    let prev = 0
    let next = 0
    while (curr.isBefore(end) || curr.isSame(end, "day")) {
      const dateStr = curr.format("YYYY-MM-DD")
      if (curr.isBefore(mid)) prev += actualDemand?.find(d => d.date === dateStr)?.customers || 0
      else next += actualDemand?.find(d => d.date === dateStr)?.customers || 0
      curr = curr.add(1, "day")
    }
    return prev === 0 ? [0, next] : [parseFloat(((next - prev) / prev).toFixed(2)), next]
  }, [actualDemand])
  const DemandDiffIcon = demandDiff[0] > 0 ? IconArrowUpRight : IconArrowDownRight
  const costDiff = 10
  const CostDiffIcon = costDiff > 0 ? IconArrowUpRight : IconArrowDownRight

  useEffect(() => {
    // @ts-ignore
    if (view === DateInterval.Monthly) setTimeRange(getPastTwelveMonths())
    // @ts-ignore
    else if (view === DateInterval.Daily) setTimeRange([getPastFourteenDays()[0], getSevenDaysAfter()])
  }, [view])

  return (
    <Container fluid p="md">
      <LoadingOverlay
        pos="fixed"
        visible={isDemandLoading || isForecastLoading}
        overlayProps={{ blur: 2 }}
      />
      <Grid>
        <Grid.Col span={12}>
          <Title order={2}>Dashboard</Title>
        </Grid.Col>

        <Grid.Col span={isMobile ? 12 : 4} style={{ alignItems: "stretch" }} order={1}>
          <Paper withBorder h="100%" p="md">
            <Group justify="space-between">
              <Title order={5}>Walk-in Traffic</Title>
              <IconUsers size="1.4rem" stroke={1.5} />
            </Group>
            <Group align="flex-end" gap="xs" mt={25}>
              <Text size="lg">{demandDiff[1]}</Text>
              <Text c={demandDiff[0] > 0 ? "teal" : "red"} fz="sm" fw={500}>
                <span>{demandDiff[0]}%</span>
                <DemandDiffIcon size="1rem" stroke={1.5} />
              </Text>
            </Group>
            <Text c="dimmed">
              compared to last week.
            </Text>
          </Paper>
        </Grid.Col>

        <Grid.Col span={isMobile ? 12 : 4} style={{ alignItems: "stretch" }} order={1}>
          <Paper withBorder h="100%" p="md" radius="md">
            <Title order={5}>No. Employees by Role</Title>
            <Space h="sm" />
            <List
              withPadding
              center
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              {empByRole ? (
                Object.entries(empByRole).map(([k, v]) => (
                  <ListItem key={k} component="span">
                    <Group>
                      <Text>{k}</Text>
                      <Text>{v}</Text>
                    </Group>
                  </ListItem>
                ))
              ) : (
                <Text>No employee data found.</Text>
              )}
            </List>
          </Paper>
        </Grid.Col>

        <Grid.Col span={isMobile ? 12 : 4} style={{ alignItems: "stretch" }} order={1}>
          <Paper withBorder h="100%" p="md" radius="md">
            <Title order={5}>No. Employees by Type</Title>
            <Space h="sm" />
            <List
              withPadding
              center
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              {empByType ? (
                Object.entries(empByType).map(([k, v]) => (
                  <ListItem key={k} component="span">
                    <Group>
                      <Text>{k}</Text>
                      <Text>{v}</Text>
                    </Group>
                  </ListItem>
                ))
              ) : (
                <Text>No employee data found.</Text>
              )}
            </List>
          </Paper>
        </Grid.Col>

        <Grid.Col
          span={isMobile ? 12 : 8}
          style={{ alignItems: "stretch" }}
          order={isMobile ? 2 : 1}
        >
          <Paper withBorder p="md" h="100%">
            <Title order={4} p="md">
              Today's Walk-in Traffic Forecast (Hourly):
            </Title>
            <BarChart
              h={300}
              data={hourlyDemand}
              dataKey="hour"
              series={[{ name: "predicted", label: "Walk-in Traffic", color: "orange.6" }]}
            />
          </Paper>
        </Grid.Col>

        <Grid.Col span={isMobile ? 12 : 4} order={isMobile ? 1 : 2}>
          <Stack gap="xl" h="100%" justify="flex-start">
            <Paper withBorder p="md">
              <Group justify="space-between">
                <Title order={5}>Manpower Cost</Title>
                <IconCoin size="1.4rem" stroke={1.5} />
              </Group>
              <Group align="flex-end" gap="xs" mt={25}>
                <Text size="lg">{costDiff}</Text>
                <Text c={costDiff > 0 ? "teal" : "red"} fz="sm" fw={500}>
                  <span>{costDiff}%</span>
                  <CostDiffIcon size="1rem" stroke={1.5} />
                </Text>
              </Group>
              <Text c="dimmed">
                compared to last week.
              </Text>
            </Paper>

            <InputDemandForm />
          </Stack>
        </Grid.Col>

        <Grid.Col span={12} order={3}>
          <Space h="md" />
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : 4} order={3}>
          <Select
            value={view}
            onChange={(val) => setView(val as DateInterval)}
            data={Object.values(DateInterval)}
            label="Current Selected View"
            placeholder="Select option"
            width={200}
          />
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : 4} order={3}>
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
        <Grid.Col span={4} order={3} />

        <Grid.Col span={isMobile ? 12 : 6} order={3}>
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

        <Grid.Col span={isMobile ? 12 : 6} order={3}>
          <Paper withBorder p="md" h="100%">
            <Title order={4} p="md">
              Upcoming Events:
            </Title>
            <BarChart
              h={300}
              data={upcomingEventData}
              dataKey="date"
              series={[{ name: "count", label: "Events", color: "blue.6" }]}
              tickLine="xy"
              withLegend
            />
          </Paper>
        </Grid.Col>

        <Grid.Col span={12} order={3}>
          <Paper withBorder p="md">
            <Title order={4} p="md">
              Walk-in Traffic (Predicted vs Actual):
            </Title>
            <LineChart
              h={300}
              data={demand}
              dataKey="date"
              series={[
                { name: "predicted", label: "Predicted", color: "orange.6" },
                { name: "actual", label: "Actual", color: "teal.6" },
              ]}
              curveType="linear"
              tickLine="xy"
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
