import {
  Button,
  Divider,
  Text,
  Paper,
  Stack,
  Container,
  Grid,
  NumberInput,
  Space,
  GridCol,
  List,
  ListItem,
  ColorSwatch,
  ScrollArea,
  ActionIcon,
  ModalBody,
  Modal,
  Box,
  Group,
  useMantineColorScheme,
} from "@mantine/core"
import { WeeklySchedule } from "../components/schedule/WeeklySchedule"
import { IconPlus, IconShare2 } from "@tabler/icons-react"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AddScheduleModal } from "../components/AddScheduleModal"
import {
  useDeleteSchedule,
  useLocalSchedule,
  useSchedules,
  useUpdateSchedule,
} from "../hooks/use-schedules"
import { getStartOfWeek, getEndOfWeek } from "@mantine/dates"
import { compareDates } from "../utils/time"
import { isObjectEqual } from "../utils/object"
import { useGenerateSchedule } from "../hooks/use-schedules"
import { ScheduleParameters } from "../types/schedule"
import { useAddSchedule } from "../hooks/use-schedules"
import { mutate } from "swr"
import html2canvas from "html2canvas"
import { hours } from "../types/constants"

export function Planner() {
  const { schedules, isLoading } = useSchedules()
  const { colorScheme } = useMantineColorScheme()
  const addSchedule = useAddSchedule()
  const updateSchedule = useUpdateSchedule()
  const deleteSchedule = useDeleteSchedule()
  const generateSchedule = useGenerateSchedule()
  const [opened, { open, close }] = useDisclosure(false) // modal for adding new shift
  const scheduleRef = useRef<HTMLDivElement>()
  const legendRef = useRef<HTMLDivElement>()
  const headerRef = useRef<HTMLDivElement>()

  const isMobile = useMediaQuery("(max-width: 50em)")

  const now = new Date()
  const weekStart = getStartOfWeek(now)
  const weekEnd = getEndOfWeek(now)

  // filters list of all schedules to those in current week, sorted by id
  const currWeekSchedule = useMemo(() => {
    return (
      schedules
        .filter((s) => compareDates(s.week, weekStart) >= 0 && compareDates(s.week, weekEnd) <= 0)
        .sort((a, b) => a.id - b.id) ?? []
    )
  }, [schedules])

  // store local values of the schedule before we update or revert changes
  const localSched = useLocalSchedule((state) => state.items)
  const setLocalSched = useLocalSchedule((state) => state.setItem)
  useEffect(() => {
    if (isLoading) return // prevent local changes from propagating infinitely if still fetching schedule data
    setLocalSched(currWeekSchedule)
  }, [currWeekSchedule])

  // keep track of whether there has been a change in he schedule
  const [hasChanged, setHasChanged] = useState(false)
  useEffect(() => {
    if (localSched.length !== currWeekSchedule.length) {
      setHasChanged(true)
      return
    }
    for (let i = 0; i < localSched.length; i++) {
      const match = currWeekSchedule.find(
        (s) => s.id === localSched[i].id && !isObjectEqual(localSched[i], s),
      )
      if (match) {
        setHasChanged(true)
        return
      }
    }
    setHasChanged(false)
  }, [localSched, currWeekSchedule])

  // revert schedule to value that was retrieved in the database
  const revertChanges = useCallback(() => {
    setLocalSched(currWeekSchedule)
  }, [currWeekSchedule])

  const handleSave = useCallback(async () => {
    const requests = []
    const ids = new Set(currWeekSchedule.map((s) => s.id))
    for (let i = 0; i < localSched.length; i++) {
      if (localSched[i].id < 0) {
        // negative id value means it is a newly created schedule
        const newSched = localSched[i]
        delete newSched.id
        requests.push(addSchedule(newSched))
      } else {
        if (
          !isObjectEqual(
            currWeekSchedule.find((s) => s.id === localSched[i].id),
            localSched[i],
          )
        ) {
          requests.push(updateSchedule(localSched[i]))
        }
        ids.delete(localSched[i].id)
      }
    }
    // delete schedule objects that are no longer in the client version of the schedule
    for (const id of ids.values()) {
      requests.push(deleteSchedule(id))
    }
    const results = await Promise.allSettled(requests)
    mutate("/schedule") // trigger refetch only after all requests have been settled
  }, [localSched, currWeekSchedule])

  const handleGenerate = async () => {
    // TODO: create parameter object
    const params: ScheduleParameters = {}
    await generateSchedule(params)
  }

  // build a new component from the associated elements and save it as an image
  const handleExport = async () => {
    const parent = document.createElement("div")
    parent.style.padding = "var(--mantine-spacing-lg)"
    parent.style.position = "absolute"
    parent.style.left = "-9999px"
    parent.style.top = "-9999px"
    console.log(colorScheme)
    parent.style.backgroundColor =
      colorScheme === "light" ? "var(--mantine-color-gray-0)" : "var(--mantine-color-dark-7)"
    document.body.appendChild(parent)
    const container = document.createElement("div")
    const ncols = 3 + hours.length * 2
    container.style.display = "grid"
    container.style.gridTemplateColumns = `repeat(${ncols}, 1fr)`
    container.style.overflowX = "auto"
    container.style.minWidth = `${hours.length * 64}px`
    container.style.padding = "var(--mantine-spacing-lg)"

    const legend = document.createElement("div")
    legend.style.gridColumn = `span ${Math.round(ncols * 0.15)}`
    const header = document.createElement("div")
    header.style.gridColumn = `span ${Math.round(ncols * 0.85)}`
    header.style.display = "flex"
    header.style.justifyContent = "center"
    header.style.alignItems = "center"
    header.appendChild(headerRef.current.cloneNode(true))
    legend.appendChild(legendRef.current.cloneNode(true))
    container.appendChild(header)
    container.appendChild(legend)

    parent.appendChild(container)
    parent.appendChild(scheduleRef.current.cloneNode(true))

    const canvas = await html2canvas(parent)
    const image = canvas.toDataURL("image/png", 1.0)

    const link = document.createElement("a")
    link.href = image
    link.download = `Schedule ${formatDate(weekStart)} ${formatDate(weekEnd)}`
    link.click()
    document.body.removeChild(parent)
  }

  const formatDate = (date: Date) => {
    const months = [
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
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear().toString()
    return `${day} ${month} ${year}`
  }

  return (
    <Container fluid>
      <Stack style={{ alignItems: "center" }}>
        <Box p="md">
          <Text size="xl" fw={700}>
            Shift Planner
          </Text>
          <Text>
            Use this interface to automatically assign shifts among your staff on a weekly basis.
            Here's a list of things of what you can do on this page:
          </Text>
          <List>
            <ListItem>
              Click the button at the bottom of the page to generate a new schedule based on the
              settings shown. The schedule will account for their availability and working hours as
              much as possible.
            </ListItem>
            <ListItem>
              Click and drag using your mouse to adjust the start and end times for each shift.
            </ListItem>
            <ListItem>
              Hover your mouse over a schedule to assign it to another employee, or to change the
              allocated role.
            </ListItem>
            <ListItem>
              Click the `Save Changes` button below to save any changes you made to the schedule.
            </ListItem>
            <ListItem>
              Export this schedule as an image to share the finalised schedule with your staff.
            </ListItem>
          </List>
        </Box>

        <Stack ref={headerRef} gap="sm" style={{ textAlign: "center" }}>
          <Text size="lg" fw={700}>
            Staff schedule for the week:
          </Text>
          <Text size="xl" fw={700}>
            {formatDate(weekStart)} — {formatDate(weekEnd)}
          </Text>
        </Stack>
      </Stack>

      <ScrollArea>
        <WeeklySchedule ref={scheduleRef} />
      </ScrollArea>

      <Divider
        label={
          <ActionIcon onClick={open} variant="subtle" w="fit-content" px="xs">
            <IconPlus />
            Assign New Shift
          </ActionIcon>
        }
        labelPosition="center"
      />

      <Modal title="Add New Shift" centered fullScreen={isMobile} opened={opened} onClose={close}>
        <ModalBody>
          <AddScheduleModal onSubmit={close} />
        </ModalBody>
      </Modal>

      <Space h="md" />

      <Grid>
        <GridCol span={isMobile ? 12 : 4}>
          <Stack>
            <Paper ref={legendRef} withBorder p="md" radius="md">
              <Text size="lg" fw={700}>
                Legend
              </Text>
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

            <Button onClick={handleExport}>
              <Group gap="sm">
                Export as Image
                <IconShare2 />
              </Group>
            </Button>

            <Button disabled={!hasChanged} onClick={revertChanges}>
              Revert Changes
            </Button>

            <Button onClick={handleSave} disabled={!hasChanged}>
              Save Changes
            </Button>
          </Stack>
        </GridCol>

        <GridCol span={isMobile ? 12 : 8}>
          <Grid>
            <GridCol>
              <Text size="xl" fw={700}>
                Settings
              </Text>
              <Text>Adjust these inputs according to your current policy.</Text>
            </GridCol>
            <GridCol span={6} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <NumberInput
                label="Max Work Hours per Week (FT)"
                defaultValue={60}
                min={0}
                allowDecimal={false}
              />
              <NumberInput
                label="Weekly Salary (FT)"
                placeholder="Dollars"
                defaultValue={600.0}
                decimalScale={2}
                fixedDecimalScale
                min={0}
                prefix="$"
              />
              <NumberInput
                label="Max Work Hours per Week (PT)"
                defaultValue={48}
                min={0}
                allowDecimal={false}
              />
              <NumberInput
                label="Hourly Rate (PT)"
                placeholder="Dollars"
                defaultValue={14.0}
                decimalScale={2}
                fixedDecimalScale
                min={0}
                prefix="$"
              />
            </GridCol>
            <GridCol span={6} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <NumberInput
                label="Min. Number of Chefs"
                defaultValue={4}
                min={0}
                allowDecimal={false}
              />
              <NumberInput
                label="Min. Number of Waiters"
                defaultValue={3}
                min={0}
                allowDecimal={false}
              />
              <NumberInput
                label="Min. Number of Dishwashers"
                defaultValue={1}
                min={0}
                allowDecimal={false}
              />
            </GridCol>
          </Grid>

          <Button mt="md" fullWidth onClick={handleGenerate}>
            Generate Schedule
          </Button>
        </GridCol>
      </Grid>

      <Space h="xl" />
    </Container>
  )
}
