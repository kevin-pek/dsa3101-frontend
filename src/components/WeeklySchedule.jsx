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
  Popover,
  PopoverDropdown,
  PopoverTarget,
  Select,
  Button,
  useMantineColorScheme,
} from "@mantine/core"
import { IconSwitch } from "@tabler/icons-react"
import React, { useEffect, useState } from "react"
import RangeSlider from "./RangeSlider"
import "react-range-slider-input/dist/style.css"
import "./rangeslider.css"
import "./schedule.css"

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const hours = [
  "10am",
  "11am",
  "12pm",
  "1pm",
  "2pm",
  "3pm",
  "4pm",
  "5pm",
  "6pm",
  "7pm",
  "8pm",
  "9pm",
  "10pm",
]

const schedules = [{ name: "Employee", start: "1230", end: "1900" }]

const employees = ["John", "Madden"]

const SwapEmployeePopover = ({ open }) => {
  const handleSwap = () => {
    console.log("Swap!")
  }

  return (
    <Popover trapFocus shadow="md" position="bottom" offset={-50} opened={open}>
      <PopoverTarget>
        <Group p={0}>
          <ActionIcon variant="subtle" w="fit-content">
            <IconSwitch />
            Swap
          </ActionIcon>
        </Group>
      </PopoverTarget>
      <PopoverDropdown>
        <Stack>
          <Select
            label="Swap with:"
            placeholder="Select another employee..."
            data={employees}
            comboboxProps={{ withinPortal: false }}
          />
          <Button onClick={handleSwap}>Save</Button>
        </Stack>
      </PopoverDropdown>
    </Popover>
  )
}

const TimeRangeSlider = (props) => {
  const [value, setValue] = useState([0, hours.length * 2]) // upper and lower bound of the range
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)

  const handleMouseHover = (e) => {
    if (e.target.classList.contains("range-slider__range")) {
      if (!hovering) {
        const rect = e.target.getBoundingClientRect()
        const yOffset = 4
        const xOffset = 44
        setHoverPos({
          x: e.clientX - xOffset,
          y: rect.top - rect.height - yOffset,
        })
      }
      setHovering(true)
    }
  }

  const handleMouseEnter = (e) => {
    // show thumb adjustment slider icons when hovering the slider range
    e.target.parentNode
      .querySelectorAll(".range-slider__thumb")
      .forEach((child) => {
        child.style.background = "var(--mantine-color-gray-0)"
      })
  }

  const handleMouseLeave = (e) => {
    // remove thumb adjustment slider icons when no longer hovering the slider
    e.target.parentNode
      .querySelectorAll(".range-slider__thumb")
      .forEach((child) => {
        child.style.background = "transparent"
      })
  }

  return (
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
      <HoverCardDropdown
        hidden={!hovering}
        p={4}
        left={hoverPos.x}
        top={hoverPos.y}
      >
        <SwapEmployeePopover />
      </HoverCardDropdown>
    </HoverCard>
  )
}

/**
 * Displays a day entry in the schedule. Height grows with number of employees in schedule.
 */
const DayTimeline = ({ schedules }) => {
  const theme = useMantineColorScheme()

  // Generate alternating background color based on number of partitions
  useEffect(() => {
    const rangeSliders = document.querySelectorAll(".day")
    const darkMode = theme.colorScheme === "dark"
    rangeSliders.forEach((slider) => {
      const color1 = darkMode
        ? "var(--mantine-color-dark-6)"
        : "var(--mantine-color-gray-0)"
      const color2 = darkMode
        ? "var(--mantine-color-dark-7)"
        : "var(--mantine-color-gray-2)"
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
    // <Stack gap={4}>
    <Stack className="day" gap={2} py="8px">
      {schedules.map((e, i) => (
        <TimeRangeSlider key={i} />
      ))}
    </Stack>
    // </Stack>
  )
}

export const WeeklySchedule = ({ schedule }) => {
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
        <GridCol
          key={i}
          span={2}
          style={{ textAlign: "center" }}
          className="hour-col"
        >
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
            <DayTimeline schedules={schedules} />
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
