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
  ModalHeader,
  LoadingOverlay,
  Loader,
  Center,
  Title,
} from "@mantine/core"
import { WeeklySchedule } from "../components/schedule/WeeklySchedule"
import { IconArrowBackUp, IconCheck, IconPlus, IconShare2 } from "@tabler/icons-react"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AddScheduleModal } from "../components/AddScheduleModal"
import { useDeleteSchedule, useLocalSchedule, useUpdateSchedule } from "../hooks/use-schedules"
import { getStartOfWeek, getEndOfWeek } from "@mantine/dates"
import { compareDates } from "../utils/time"
import { isObjectEqual } from "../utils/object"
import { useGenerateSchedule } from "../hooks/use-schedules"
import { Schedule, ScheduleParameters } from "../types/schedule"
import { useAddSchedule } from "../hooks/use-schedules"
import useSWR, { mutate } from "swr"
import html2canvas from "html2canvas"
import { hours } from "../types/constants"
import { fetcher } from "../api"
import { notifications } from "@mantine/notifications"

export function Planner() {
  const { data: schedules, isLoading } = useSWR<Schedule[]>("/schedule", fetcher)
  const { colorScheme } = useMantineColorScheme()
  const addSchedule = useAddSchedule()
  const [opened, { open, close }] = useDisclosure(false) // modal for adding new shift
  const updateSchedule = useUpdateSchedule()
  const deleteSchedule = useDeleteSchedule()
  const generateSchedule = useGenerateSchedule()
  const [maxHrFT, setMaxHrFT] = useState(44)
  const [maxHrPT, setMaxHrPT] = useState(35)
  const [genErrOpen, { open: openGenErr, close: closeGenErr }] = useDisclosure(false) // modal for adding new shift
  const [loader, { open: openLoader, close: closeLoader }] = useDisclosure(false)
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
        ?.filter((s) => compareDates(s.week, weekStart) >= 0 && compareDates(s.week, weekEnd) <= 0)
        ?.sort((a, b) => a.id - b.id) ?? []
    )
  }, [schedules])

  // store local values of the schedule before we update or revert changes
  const localSched = useLocalSchedule((state) => state.items)
  const setLocalSched = useLocalSchedule((state) => state.setItem)
  useEffect(() => {
    if (isLoading) return // prevent local changes from propagating infinitely if still fetching schedule data
    setLocalSched(currWeekSchedule)
  }, [currWeekSchedule])

  // keep track of whether there has been a change in the local copy of schedule
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
    notifications.show({
      color: "teal",
      title: "Success",
      message: `Schedule saved successfully.`,
      icon: <IconCheck />,
      loading: false,
      autoClose: 2000,
      withCloseButton: true,
    })
    mutate("/schedule") // trigger refetch only after all requests have been settled
  }, [localSched, currWeekSchedule])

  const handleGenerate = async () => {
    const params: ScheduleParameters = {
      maxHrFT,
      maxHrPT,
    }

    try {
      openLoader()
      await generateSchedule(params)
      closeGenErr()
    } catch (err) {
      // TODO: Standardise error format for triggering output
      if (err.msg === "Infeasible Problemn") {
        openGenErr()
      }
    }
    closeLoader()
  }

  // build a new component from the associated elements and save it as an image
  const handleExport = async () => {
    const parent = document.createElement("div")
    parent.style.width = `${(hours.length + 2) * 64}px`
    parent.style.padding = "var(--mantine-spacing-lg)"
    parent.style.position = "absolute"
    parent.style.left = "-9999px"
    parent.style.top = "-9999px"
    parent.style.backgroundColor = colorScheme === "light" ? "white" : "var(--mantine-color-dark-7)"
    document.body.appendChild(parent)
    const container = document.createElement("div")
    const ncols = 3 + hours.length * 2
    container.style.display = "grid"
    container.style.gridTemplateColumns = `repeat(${ncols}, 1fr)`
    container.style.overflowX = "auto"
    container.style.minWidth = `${hours.length * 64}px`
    container.style.padding = "var(--mantine-spacing-lg)"

    const legend = document.createElement("div")
    legend.style.gridColumn = `span ${Math.round(ncols * 0.3)}`
    const header = document.createElement("div")
    header.style.gridColumn = `span ${Math.round(ncols * 0.7)}`
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
    <Container fluid px={6}>
      <LoadingOverlay
        pos="fixed"
        visible={isLoading || loader}
        overlayProps={{ blur: 2 }}
        loaderProps={{
          children: (
            <Center display="flex" style={{ flexDirection: "column", gap: 8 }}>
              <Loader />
              Generating Schedule...
            </Center>
          ),
        }}
      />
      <Stack p="sm" style={{ alignItems: "center" }}>
        <Box p="md">
          <Title order={2}>Shift Planner</Title>
          <Space h="md" />
          <Text>
            Use this interface to automatically assign shifts among your staff on a weekly basis.
            Here's a list of things of what you can do on this page:
          </Text>
          <Space h="md" />
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
          <Title order={3}>Staff schedule for the week:</Title>
          <Title order={2}>
            {formatDate(weekStart)} — {formatDate(weekEnd)}
          </Title>
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

      <Grid px="md">
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
          </Stack>
        </GridCol>

        <GridCol span={isMobile ? 12 : 4}>
          <Stack gap="sm">
            <Space h={isMobile ? "md" : "sm"} />
            <Button onClick={handleSave} disabled={!hasChanged}>
              <Group gap="sm">
                Save Changes
                <IconCheck />
              </Group>
            </Button>

            <Button disabled={!hasChanged} onClick={revertChanges} variant="default">
              <Group gap="sm">
                Undo Changes
                <IconArrowBackUp />
              </Group>
            </Button>

            <Space />
          </Stack>
        </GridCol>

        <GridCol span={isMobile ? 12 : 4}>
          <Stack gap="sm">
            <Space h={isMobile ? "md" : "sm"} />
            <Button fullWidth onClick={handleGenerate}>
              <Group gap="sm">
                Generate Schedule
                <IconPlus />
              </Group>
            </Button>

            <Button fullWidth onClick={handleExport}>
              <Group gap="sm">
                Export Schedule
                <IconShare2 />
              </Group>
            </Button>
            <Space />
          </Stack>
        </GridCol>
      </Grid>

      <Space h="xl" />
      <Space h="xl" />

      <Modal centered fullScreen={isMobile} opened={genErrOpen} onClose={closeGenErr}>
        <ModalHeader>
          <Text fw={700} size="xl">
            Error Generating Schedule
          </Text>
        </ModalHeader>
        <ModalBody>
          <Stack>
            <Space h="md" />
            <Text>
              Schedule could not be generated because max working hours for your staff are too low
              to meet the staffing requirements.
            </Text>
            <Text>
              Please raise the maximum working hours for your staff to generate a schedule.
            </Text>
            <Space h="md" />
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "8px",
              }}
            >
              <NumberInput
                label="Max Hours Full Time"
                value={maxHrFT}
                onChange={setMaxHrFT}
                min={44}
                suffix=" hrs per week"
                clampBehavior="blur"
                allowDecimal={false}
              />
              <NumberInput
                label="Max Hours Part Time"
                value={maxHrPT}
                onChange={setMaxHrPT}
                min={35}
                suffix=" hrs per week"
                clampBehavior="blur"
                allowDecimal={false}
              />
            </Box>
            <Space h="lg" />
            <Button fullWidth onClick={handleGenerate}>
              Generate Schedule
            </Button>
            <Space h="sm" />
          </Stack>
        </ModalBody>
      </Modal>
    </Container>
  )
}
