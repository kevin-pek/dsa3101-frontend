import {
  Grid,
  Text,
  Box,
  GridCol,
  Group,
  Stack,
  Divider,
  ActionIcon,
  HoverCard,
  HoverCardDropdown,
  HoverCardTarget,
  Select,
  Button,
  useMantineColorScheme,
  Modal,
  ModalBody,
} from "@mantine/core"
import { IconSwitch } from "@tabler/icons-react"
import React, { useCallback, useEffect, useState, useMemo, useRef } from "react"
import RangeSlider from "./RangeSlider"
import "react-range-slider-input/dist/style.css"
import "./rangeslider.css"
import "./schedule.css"
import { useEmployees } from "../hooks/use-employees"
import { useSchedule } from "../hooks/use-schedule"
import { useSWRConfig } from "swr"
import { roles, hours, daysOfWeek } from "../utils/constants"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"

const SwapEmployeeModal = ({ onSubmit }) => {
  const { employees } = useEmployees()
  const { schedule } = useSchedule()
  const { mutate } = useSWRConfig()
  const [selectedEmployee, setSelectedEmployee] = useState()
  const [employeeError, setEmployeeError] = useState("")
  const [role, setRole] = useState()
  const [roleError, setRoleError] = useState("")

  const handleSwap = useCallback(() => {
    console.log("Swap!")
    let valid = true
    const employee = employees.find((e) => e.name === selectedEmployee)?.id
    if (!employee) {
      setEmployeeError("Invalid employee selected!")
      valid = false
    } else setEmployeeError("")
    if (!role || !roles.includes(role)) {
      setRoleError("Invalid role selected!")
      valid = false
    } else setRoleError("")
    if (valid) {
      // mutate("Schedule", [...schedule])
      onSubmit()
    }
  }, [selectedEmployee, employees, role, schedule])

  const employeeData = useMemo(() => employees.map((e) => e.name), [employees])

  return (
    <Stack>
      <Select
        required
        label="Swap with:"
        placeholder="Select another employee..."
        data={employeeData}
        value={selectedEmployee}
        onChange={setSelectedEmployee}
        comboboxProps={{ withinPortal: false }}
        searchable
        nothingFoundMessage="No employees found..."
        error={employeeError}
      />
      <Select
        required
        label="Role:"
        placeholder="Change role..."
        data={roles}
        value={role}
        onChange={setRole}
        comboboxProps={{ withinPortal: false }}
        error={roleError}
      />
      <Button type="submit" onClick={handleSwap}>
        Swap
      </Button>
    </Stack>
  )
}

const TimeRangeSlider = () => {
  const [value, setValue] = useState([0, hours.length * 2]) // upper and lower bound of the range
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const [opened, { open, close }] = useDisclosure(false) // popover open
  const isMobile = useMediaQuery("(max-width: 50em)")

  const handleMouseHover = (e) => {
    if (e.target.classList.contains("range-slider__range")) {
      if (!hovering) {
        const rect = e.target.getBoundingClientRect()
        const yOffset = 4
        const xOffset = 44
        setHoverPos({
          x: e.clientX - xOffset,
          y: window.scrollY + rect.top - rect.height - yOffset,
        })
      }
      setHovering(true)
    }
  }

  const handleMouseEnter = (e) => {
    // show thumb adjustment slider icons when hovering the slider range
    e.target.parentNode.querySelectorAll(".range-slider__thumb").forEach((child) => {
      child.style.background = "var(--mantine-color-gray-0)"
    })
  }

  const handleMouseLeave = (e) => {
    // remove thumb adjustment slider icons when no longer hovering the slider
    e.target.parentNode.querySelectorAll(".range-slider__thumb").forEach((child) => {
      child.style.background = "transparent"
    })
  }

  return (
    <>
      <HoverCard position="top" withArrow onClose={() => setHovering(false)}>
        <HoverCardTarget>
          <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <RangeSlider
              onMouseEnterRange={handleMouseHover}
              step={1}
              min={0}
              max={hours.length * 2}
              value={value}
              onInput={(val, userInt) => setValue(val)}
            >
              Label
            </RangeSlider>
          </Box>
        </HoverCardTarget>
        <HoverCardDropdown hidden={!hovering} p={4} left={hoverPos.x} top={hoverPos.y}>
          <Group p={0}>
            <ActionIcon
              onClick={() => {
                open()
                setHovering(false)
              }}
              variant="subtle"
              w="fit-content"
            >
              <IconSwitch />
              Swap
            </ActionIcon>
          </Group>
        </HoverCardDropdown>
      </HoverCard>
      <Modal opened={opened} onClose={close} title="Swap Shift" centered fullScreen={isMobile}>
        <ModalBody>
          <SwapEmployeeModal onSubmit={close} />
        </ModalBody>
      </Modal>
    </>
  )
}

/**
 * Displays a day entry in the schedule. Height grows with number of employees in schedule.
 */
const DayTimeline = () => {
  const { schedule } = useSchedule()
  const theme = useMantineColorScheme()

  // Generate alternating background color based on number of partitions
  useEffect(() => {
    const rangeSliders = document.querySelectorAll(".day")
    const darkMode = theme.colorScheme === "dark"
    rangeSliders.forEach((slider) => {
      const color1 = darkMode ? "var(--mantine-color-dark-6)" : "var(--mantine-color-gray-0)"
      const color2 = darkMode ? "var(--mantine-color-dark-7)" : "var(--mantine-color-gray-2)"
      const partitions = hours.length
      const gradientParts = []
      for (let i = 0; i < partitions; i++) {
        const color = i % 2 === 0 ? color1 : color2
        const start = (i / partitions) * 100
        const end = ((i + 1) / partitions) * 100
        gradientParts.push(`${color} ${start}%`, `${color} ${end}%`)
      }
      const gradientString = `linear-gradient(to right, ${gradientParts.join(", ")})`
      slider.style.background = gradientString
    })
  }, [theme])

  return (
    <Stack className="day" gap={2} py="8px">
      {schedule.map((e, i) => (
        <TimeRangeSlider key={i} />
      ))}
    </Stack>
  )
}

export const WeeklySchedule = () => {
  const { schedule } = useSchedule()
  const sidebarCols = 4
  const cols = sidebarCols + hours.length * 2
  const minColWidth = 64

  return (
    <Grid
      columns={cols}
      p="lg"
      style={{ overflowX: "auto", minWidth: `${hours.length * minColWidth}px` }}
    >
      <GridCol
        span={sidebarCols}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box />
        <Text size="lg">Day/Time</Text>
        <Divider orientation="vertical" />
      </GridCol>

      {hours.map((hr, i) => (
        <GridCol key={i} span={2} style={{ textAlign: "center" }} className="hour-col">
          {hr}
        </GridCol>
      ))}

      <GridCol span={cols}>
        <Divider />
      </GridCol>

      {daysOfWeek.map((day, i) => (
        <React.Fragment key={i}>
          <GridCol
            span={sidebarCols}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box />
            <Text size="lg">{day}</Text>
            <Divider orientation="vertical" />
          </GridCol>

          <GridCol span={hours.length * 2}>
            <DayTimeline schedule={schedule} />
          </GridCol>

          {i !== daysOfWeek.length - 1 && (
            <GridCol span={cols}>
              <Divider />
            </GridCol>
          )}
        </React.Fragment>
      ))}
    </Grid>
  )
}
