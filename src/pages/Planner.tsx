import {
  Button,
  Divider,
  Text,
  Paper,
  Stack,
  Group,
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
  Center,
} from "@mantine/core"
import { WeeklySchedule } from "../components/schedule/WeeklySchedule"
import { IconCoin, IconArrowUpRight, IconArrowDownRight, IconPlus } from "@tabler/icons-react"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import React, { useEffect, useState } from "react"
import { AddScheduleModal } from "../components/AddSchedulePopover"
import { useSchedules } from "../hooks/use-schedules"
import { getStartOfWeek, getEndOfWeek } from "@mantine/dates"
import { Schedule } from "../types/schedule"
import { compareDates } from "../utils/time"

export function Planner() {
  const { schedules } = useSchedules()
  const [opened, { open, close }] = useDisclosure(false) // modal for adding shift open
  const cost = 1000
  const diff = -10
  const DiffIcon = diff > 0 ? IconArrowUpRight : IconArrowDownRight

  const isMobile = useMediaQuery("(max-width: 50em)")

  // schedules to display are those that fall within the current week
  const [currSched, setCurrSched] = useState<Schedule[]>([])
  const now = new Date()
  const weekStart = getStartOfWeek(now)
  const weekEnd = getEndOfWeek(now)
  useEffect(() => {
    const sched = schedules.filter(s => (compareDates(s.week, weekStart) >= 0 && compareDates(s.week, weekEnd) <= 0))
    setCurrSched(sched.length > 0 ? sched : [])
  }, [schedules])

  const formatDate = (date: Date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear().toString()
    return `${day} ${month} ${year}`
  }

  return (
    <Container fluid>
          <Paper p="md" radius="md">
            <Text size="xl" fw={700}>
              Shift Planner
            </Text>
            <Text>Use this interface to automatically assign shifts among your staff on a weekly basis. Here's a list of things of what you can do on this page:</Text>
            <List>
              <ListItem>Click the button at the bottom of the page to generate a new schedule based on the settings shown. The schedule will account for their availability and working hours as much as possible.</ListItem>
              <ListItem>Click and drag using your mouse to adjust the start and end times for each shift.</ListItem>
              <ListItem>Hover your mouse over a schedule to assign it to another employee, or to change the allocated role.</ListItem>
              <ListItem>Click to save any changes you made to the schedule.</ListItem>
              <ListItem>Export this schedule as an image to share the finalised schedule with your staff.</ListItem>
            </List>
          </Paper>

      <Grid>
        <GridCol span={isMobile ? 12 : 8}>
          <Center style={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
            <Text size="lg">Showing staff schedule for the week:</Text>
            <Text size="xl" fw={500}>{formatDate(weekStart)} — {formatDate(weekEnd)}</Text>
          </Center>
        </GridCol>

        <GridCol span={isMobile ? 12 : 4}>
          <Paper  p="md" radius="md">
            <Text size="lg" fw={700}>
              Legend
            </Text>
            <Text fz="md" my={8}>
              Each role is indicated by their colour.
            </Text>
            <List
              withPadding
              center
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <ListItem
                component="span"
                icon={<ColorSwatch size="1.1em" color="var(--mantine-color-violet-outline)" />}
              >
                Manager
              </ListItem>
              <ListItem
                component="span"
                icon={<ColorSwatch size="1.1em" color="var(--mantine-color-orange-outline)" />}
              >
                Kitchen
              </ListItem>
              <ListItem component="span" icon={<ColorSwatch size="1.1em" color="var(--mantine-color-green-outline)" />}>
                Server
              </ListItem>
            </List>
          </Paper>
        </GridCol>
      </Grid>

      <ScrollArea>
        <WeeklySchedule schedule={currSched} setSchedule={setCurrSched} />
      </ScrollArea>

      <Divider label={
        <ActionIcon onClick={open} variant="subtle" w="fit-content" px="xs">
          <IconPlus />
          Assign New Shift
        </ActionIcon>
      } labelPosition="center" />

      <Modal title="Add New Shift" centered fullScreen={isMobile} opened={opened} onClose={close}>
        <ModalBody>
          <AddScheduleModal onSubmit={close} />
        </ModalBody>
      </Modal>

      <Space h="md" />

      <Grid>
        <GridCol span={isMobile ? 12 : 4}>
          <Stack>
            {/* TODO: Add confirmation modal and handler for each of these */}
            <Button>Revert Changes</Button>

            <Button>Save Changes</Button>
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
