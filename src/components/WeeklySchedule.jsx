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
import { convertIndexToTime, convertTimeToIndex } from "../utils/time"

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

const TimeRangeSlider = ({ value, setValue }) => {
  const { employees } = useEmployees()
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const [opened, { open, close }] = useDisclosure(false) // popover open
  const isMobile = useMediaQuery("(max-width: 50em)")
  const [active, setActive] = useState(true)
  const rangeRef = useRef()
  const hoverRef = useRef()

  const timeIdxOffset = convertTimeToIndex(hours[0])
  const [range, setRange] = useState([
    convertTimeToIndex(value.start) - timeIdxOffset,
    convertTimeToIndex(value.end) - timeIdxOffset,
  ])
  const name = useMemo(() => employees.find((e) => e.id === value.employeeId)?.name)

  useEffect(() => {
    setValue({
      ...value,
      start: convertIndexToTime(range[0] + timeIdxOffset - 2),
      end: convertIndexToTime(range[1] + timeIdxOffset - 2),
    })
  }, [range])

  const handleMouseHover = (e) => {
    if ((isMobile && active) || !isMobile) {
      // mobile devices need to click on the range first
      if (e.target.classList.contains("range-slider__range")) {
        // show switch over mouse position in time range
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
  }

  const handleMouseEnter = (e) => {
    if ((isMobile && active) || !isMobile) {
      // mobile devices need to click on the range first
      // show thumb adjustment slider icons when hovering the slider range
      e.target.parentNode.querySelectorAll(".range-slider__thumb").forEach((child) => {
        child.style.background = "var(--mantine-color-gray-0)"
      })
    }
  }

  const handleMouseLeave = (e) => {
    if ((isMobile && active) || !isMobile) {
      // mobile devices need to click on the range first
      // remove thumb adjustment slider icons when no longer hovering the slider
      e.target.parentNode.querySelectorAll(".range-slider__thumb").forEach((child) => {
        child.style.background = "transparent"
      })
    }
  }

  useEffect(() => {
    // click handlers for mobile devices
    if (isMobile) {
      const handleClick = (e) => {
        if (rangeRef.current) {
          if (
            rangeRef.current.contains(e.target) ||
            (hoverRef.current && hoverRef.current.contains(e.target))
          ) {
            setActive(true)
          } else {
            setActive(false)
          }
        }
      }
      document.addEventListener("mousedown", handleClick)
      setActive(false) // trigger active useEffect handler
      return () => document.removeEventListener("mousedown", handleClick)
    }
  }, [isMobile])

  useEffect(() => {
    if (isMobile) {
      rangeRef.current.querySelectorAll(".range-slider__thumb").forEach((c) => {
        c.style.pointerEvents = active ? "auto" : "none"
      })
      rangeRef.current.querySelector(".range-slider__range").style.pointerEvents = active
        ? "auto"
        : "none"
    }
  }, [active])

  return (
    <>
      <HoverCard
        position="top"
        withArrow
        disabled={isMobile && !active}
        onClose={() => setHovering(false)}
      >
        <HoverCardTarget>
          <Box ref={rangeRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <RangeSlider
              disabled={isMobile && !active}
              onMouseEnterRange={handleMouseHover}
              step={1}
              min={0}
              max={hours.length * 2}
              value={range}
              onInput={(val, userInt) => setRange(val)}
              className={value.role}
            >
              {name}
            </RangeSlider>
          </Box>
        </HoverCardTarget>
        <HoverCardDropdown hidden={!hovering} p={4} left={hoverPos.x} top={hoverPos.y}>
          <Group ref={hoverRef} p={0}>
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
const DayTimeline = ({ schedule }) => {
  const theme = useMantineColorScheme()
  const [rangeValues, setRangeValues] = useState(schedule) // TODO: Update the schedule using requests when this is changed

  // function to update individual range value
  const setRangeValue = (idx, val) => {
    console.log(val)
    setRangeValues((curr) => curr.map((c, i) => (idx === i ? val : c)))
  }

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
    <Stack mih="48px" className="day" gap={2} py="8px">
      {schedule.map((sched, i) => (
        <TimeRangeSlider value={sched} setValue={(val) => setRangeValue(i, val)} key={i} />
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
            <DayTimeline schedule={schedule.filter((sched) => sched.day === day)} />
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
