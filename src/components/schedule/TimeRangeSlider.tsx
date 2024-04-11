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
  Space,
} from "@mantine/core"
import { IconSwitch, IconTrash } from "@tabler/icons-react"
import React, { useEffect, useState, useMemo, useRef, Dispatch, useCallback } from "react"
import { useEmployees } from "../../hooks/use-employees"
import { hours } from "../../types/constants"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { SwapEmployeeModal } from "../SwapEmployeeModal"
import { Schedule } from "../../types/schedule"
import RangeSlider from "./RangeSlider"
import { useLocalSchedule } from "../../hooks/use-schedules"

/**
 * Adjustable time range slider with hover behaviour and responsive design.
 * Displays name of employee on middle of entry, and color is determined by type
 * of role assigned.
 */
export const TimeRangeSlider = ({
  schedule,
  value,
  setValue,
}: {
  schedule: Schedule
  value: number[]
  setValue: Dispatch<number[]>
}) => {
  const { employees } = useEmployees()
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const [swapOpened, { open: openSwap, close: closeSwap }] = useDisclosure(false) // swap modal
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false) // delete model
  const isMobile = useMediaQuery("(max-width: 50em)")
  const [active, setActive] = useState(true)
  const rangeRef = useRef<HTMLDivElement>()
  const hoverRef = useRef<HTMLDivElement>()
  const deleteSchedule = useLocalSchedule((state) => state.removeItem)

  const name = useMemo(
    () => employees.find((e) => e.id === schedule.employeeId)?.name,
    [value, employees],
  )

  const handleDelete = useCallback(() => {
    deleteSchedule(schedule.id)
    closeDelete()
  }, [value])

  const handleMouseHover = (e) => {
    if ((isMobile && active) || !isMobile) {
      // mobile devices need to click on the range first
      if (e.target.classList.contains("range-slider__range")) {
        // show switch over mouse position in time range
        if (!hovering) {
          const rect = e.target.getBoundingClientRect()
          const yOffset = 12
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
    if (isMobile) {
      // if mobile device, add tap handler for activating each slider
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
      rangeRef.current.querySelectorAll<HTMLElement>(".range-slider__thumb").forEach((c) => {
        c.style.pointerEvents = "none"
      })
      rangeRef.current.querySelector<HTMLElement>(".range-slider__range").style.pointerEvents =
        "none"
      setActive(false) // trigger active useEffect handler
      return () => document.removeEventListener("mousedown", handleClick)
    } else {
      // if isMobile is deactivated, activate all pointer events for the sliders
      rangeRef.current.querySelectorAll<HTMLElement>(".range-slider__thumb").forEach((c) => {
        c.style.pointerEvents = "auto"
      })
      rangeRef.current.querySelector<HTMLElement>(".range-slider__range").style.pointerEvents =
        "auto"
      setActive(false)
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
              value={value}
              onInput={(val) => setValue(val)}
              className={schedule.role}
            >
              <Text style={{ transform: "translateY(-2px)" }}>{name}</Text>
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
      <Modal
        opened={swapOpened}
        onClose={closeSwap}
        title="Swap Shift"
        centered
        fullScreen={isMobile}
      >
        <ModalBody>
          <SwapEmployeeModal onSubmit={closeSwap} schedule={schedule} />
        </ModalBody>
      </Modal>
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Delete Shift"
        centered
        fullScreen={isMobile}
      >
        <ModalBody
          style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}
        >
          <Space h="xl" />
          <Stack p="md" style={{ textAlign: "center" }}>
            <Text>Confirm that you want to delete this shift? This action is not reversible!</Text>
          </Stack>
          <Space h="xl" />
          <Group>
            <Button onClick={closeDelete} variant="default" style={{ flexGrow: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleDelete} style={{ flexGrow: 1 }}>
              Delete
            </Button>
          </Group>
        </ModalBody>
      </Modal>
    </>
  )
}
