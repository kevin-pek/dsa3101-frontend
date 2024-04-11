import {
  Box,
  Group,
  ActionIcon,
  HoverCard,
  HoverCardDropdown,
  HoverCardTarget,
  Modal,
  ModalBody,
} from "@mantine/core"
import { IconSwitch } from "@tabler/icons-react"
import React, { useEffect, useState, useMemo, useRef, Dispatch } from "react"
import { useEmployees } from "../../hooks/use-employees"
import { hours } from "../../types/constants"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { convertIndexToTime, convertTimeToIndex } from "../../utils/time"
import { SwapEmployeeModal } from "../SwapEmployeeModal"
import { Schedule } from "../../types/schedule"
import RangeSlider from "./RangeSlider"

/**
 * Individual time range slider with mouse pointer events and responsive design.
 */
export const TimeRangeSlider = ({
  value,
  setValue,
}: {
  value: Schedule
  setValue: Dispatch<Schedule>
}) => {
  const { employees } = useEmployees()
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const [opened, { open, close }] = useDisclosure(false) // popover open
  const isMobile = useMediaQuery("(max-width: 50em)")
  const [active, setActive] = useState(true)
  const rangeRef = useRef<HTMLDivElement>()
  const hoverRef = useRef<HTMLDivElement>()

  const timeIdxOffset = convertTimeToIndex(hours[0])
  const [range, setRange] = useState([
    convertTimeToIndex(value.start) - timeIdxOffset,
    convertTimeToIndex(value.end) - timeIdxOffset,
  ])
  const name = useMemo(
    () => employees.find((e) => e.id === value.employeeId)?.name,
    [value, employees],
  )

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
      rangeRef.current.querySelectorAll<HTMLElement>(".range-slider__thumb").forEach((c) => {
        c.style.pointerEvents = active ? "auto" : "none"
      })
      rangeRef.current.querySelector<HTMLElement>(".range-slider__range").style.pointerEvents =
        active ? "auto" : "none"
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
