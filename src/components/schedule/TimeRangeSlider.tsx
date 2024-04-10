import {
  Box,
  Group,
  ActionIcon,
  HoverCard,
  HoverCardDropdown,
  HoverCardTarget,
  Modal,
  ModalBody,
  Button,
  Stack,
  Text,
  Space
} from "@mantine/core"
import { IconSwitch, IconTrash } from "@tabler/icons-react"
import React, { useEffect, useState, useMemo, useRef, Dispatch, useCallback } from "react"
import { useEmployees } from "../../hooks/use-employees"
import { hours } from "../../types/constants"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { convertIndexToTime, convertTimeToIndex } from "../../utils/time"
import { SwapEmployeeModal } from "../SwapEmployeeModal"
import { Schedule } from "../../types/schedule"
import RangeSlider from "./RangeSlider"
import { useDeleteSchedule } from "../../hooks/use-schedules"

/**
 * Adjustable time range slider with hover behaviour and responsive design.
 * Displays name of employee on middle of entry, and color is determined by type
 * of role assigned.
 */
export const TimeRangeSlider = ({
  value,
  setValue,
}: {
  value: Schedule
  setValue: Dispatch<Schedule>
}) => {
  const { employees } = useEmployees()
  const deleteSchedule = useDeleteSchedule()
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const [swapOpened, { open: openSwap, close: closeSwap }] = useDisclosure(false) // swap modal
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false) // delete model
  const isMobile = useMediaQuery("(max-width: 50em)")
  const [active, setActive] = useState(true)
  const rangeRef = useRef<HTMLDivElement>()
  const hoverRef = useRef<HTMLDivElement>()

  const timeIdxOffset = convertTimeToIndex(hours[0])
  const [range, setRange] = useState<number[]>([
    convertTimeToIndex(value.start) - timeIdxOffset,
    convertTimeToIndex(value.end) - timeIdxOffset,
  ]) // 2 element array containing start/end indices
  const name = useMemo(
    () => employees.find((e) => e.id === value.employeeId)?.name,
    [value, employees],
  )

  useEffect(() => {
    if (range) {
      setValue({
        ...value,
        start: convertIndexToTime(range[0] + timeIdxOffset),
        end: convertIndexToTime(range[1] + timeIdxOffset),
      })
    }
  }, [range])

  const handleDelete = useCallback(async () => {
    await deleteSchedule(value.id)
    closeDelete()
  }, [value])

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
      rangeRef.current.querySelectorAll<HTMLElement>(".range-slider__thumb").forEach((child) => {
        child.style.background = "var(--mantine-color-gray-0)"
        child.style.boxShadow = "0 0 2px gray"
      })
    }
  }

  const handleMouseLeave = (e) => {
    if ((isMobile && active) || !isMobile) {
      // mobile devices need to click on the range first
      // remove thumb adjustment slider icons when no longer hovering the slider
      rangeRef.current.querySelectorAll<HTMLElement>(".range-slider__thumb").forEach((child) => {
        child.style.background = "transparent"
        child.style.boxShadow = "none"
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
          <Group gap={4} ref={hoverRef} p={0}>
            <ActionIcon
              onClick={() => {
                openSwap()
                setHovering(false)
              }}
              variant="subtle"
              w="fit-content"
            >
              <IconSwitch />
            </ActionIcon>

            <ActionIcon
              color="red"
              onClick={() => {
                openDelete()
                setHovering(false)
              }}
              variant="subtle"
              w="fit-content"
            >
              <IconTrash />
            </ActionIcon>
          </Group>
        </HoverCardDropdown>
      </HoverCard>
      <Modal opened={swapOpened} onClose={closeSwap} title="Swap Shift" centered fullScreen={isMobile}>
        <ModalBody>
          <SwapEmployeeModal onSubmit={closeSwap} schedule={value}/>
        </ModalBody>
      </Modal>
      <Modal opened={deleteOpened} onClose={closeDelete} title="Delete Shift" centered fullScreen={isMobile}>
        <ModalBody style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <Space h="xl" />
          <Stack p="md" style={{ textAlign: "center" }}>
            <Text>Confirm that you want to delete this shift? This action is not reversible!</Text>
          </Stack>
          <Space h="xl" />
          <Group>
            <Button onClick={closeDelete} variant="default" style={{ flexGrow: 1 }}>Cancel</Button>
            <Button onClick={handleDelete} style={{ flexGrow: 1 }}>Delete</Button>
          </Group>
        </ModalBody>
      </Modal>
    </>
  )
}
