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
  Loader,
} from "@mantine/core"
import { WeeklySchedule } from "../components/schedule/WeeklySchedule"
import { IconPlus } from "@tabler/icons-react"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { AddScheduleModal } from "../components/AddSchedulePopover"
import { useLocalSchedule, useSchedules, useUpdateSchedule } from "../hooks/use-schedules"
import { getStartOfWeek, getEndOfWeek } from "@mantine/dates"
import { compareDates } from "../utils/time"
import { isObjectEqual } from "../utils/object"

export function Planner() {
  const { schedules, isLoading } = useSchedules()
  const updateSchedule = useUpdateSchedule()
  const [opened, { open, close }] = useDisclosure(false) // modal for adding new shift

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
  }, [localSched])

  // revert schedule to value that was retrieved in the database
  const revertChanges = useCallback(() => {
    setLocalSched(currWeekSchedule)
  }, [currWeekSchedule])

  const handleSave = useCallback(async () => {
    // Change this to handle both update and delete
    const newSchedules = localSched.filter(
      (s) =>
        s.id === -1 ||
        !isObjectEqual(
          s,
          currWeekSchedule.find((t) => t.id === s.id),
        ),
    )
    await Promise.all(newSchedules.map((s) => updateSchedule(s)))
  }, [localSched, currWeekSchedule])

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

        <Stack gap="sm" style={{ textAlign: "center" }}>
          <Text size="lg" fw={700}>
            Showing staff schedule for the week:
          </Text>
          <Text size="xl" fw={700}>
            {formatDate(weekStart)} — {formatDate(weekEnd)}
          </Text>
        </Stack>
      </Stack>

      <ScrollArea>
        <WeeklySchedule />
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
            <Paper withBorder p="md" radius="md">
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
                  icon={<ColorSwatch size="1em" color="var(--mantine-color-violet-outline)" />}
                >
                  Manager
                </ListItem>
                <ListItem
                  component="span"
                  icon={<ColorSwatch size="1em" color="var(--mantine-color-orange-outline)" />}
                >
                  Kitchen
                </ListItem>
                <ListItem
                  component="span"
                  icon={<ColorSwatch size="1em" color="var(--mantine-color-green-outline)" />}
                >
                  Server
                </ListItem>
              </List>
            </Paper>
            {/* TODO: Add confirmation modal and handler for each of these */}
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

          <Button mt="md" fullWidth>
            Generate Schedule
          </Button>
        </GridCol>
      </Grid>

      <Space h="xl" />
    </Container>
  )
}
