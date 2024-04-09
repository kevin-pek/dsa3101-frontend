import { Stack, useMantineColorScheme } from "@mantine/core"
import React, { Dispatch, useCallback, useEffect, useState } from "react"
import { hours } from "../../types/constants"
import { TimeRangeSlider } from "./TimeRangeSlider"
import { Schedule } from "../../types/schedule"

/**
 * Displays a day entry in the schedule. Height grows with number of employees in schedule.
 */
export const DayTimeline = ({
  schedule,
  setSchedule,
}: {
  schedule: Schedule[]
  setSchedule: Dispatch<Schedule[]>
}) => {
  const theme = useMantineColorScheme()

  // function to update individual range value
  const setScheduleRange = useCallback(
    (idx, val) => {
      setSchedule(schedule.map((c, i) => (idx === i ? val : c)))
    },
    [schedule],
  )

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
        <TimeRangeSlider value={sched} setValue={(val) => setScheduleRange(i, val)} key={i} />
      ))}
    </Stack>
  )
}
