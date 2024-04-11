import { Stack, useMantineColorScheme } from "@mantine/core"
import React, { useEffect } from "react"
import { DoW, hours } from "../../types/constants"
import { TimeRangeSlider } from "./TimeRangeSlider"
import { useLocalSchedule } from "../../hooks/use-schedules"
import { convertIndexToTime, convertTimeToIndex } from "../../utils/time"

/**
 * Displays a day entry in the schedule. Height grows with number of employees in schedule.
 */
export const DayTimeline = ({ day }: { day: DoW }) => {
  const theme = useMantineColorScheme()
  const updateSched = useLocalSchedule((state) => state.updateItem)
  const schedule = useLocalSchedule((state) => state.items).filter((s) => s.day === day)
  const timeIdxOffset = convertTimeToIndex(hours[0])

  // Generate alternating background color based on number of partitions
  useEffect(() => {
    const rangeSliders = document.querySelectorAll<HTMLElement>(".day")
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
      {schedule.map((s, i) => (
        <TimeRangeSlider
          schedule={s}
          value={[
            convertTimeToIndex(s.start) - timeIdxOffset,
            convertTimeToIndex(s.end) - timeIdxOffset,
          ]}
          setValue={(val) => {
            updateSched({
              ...s,
              start: convertIndexToTime(val[0] + timeIdxOffset),
              end: convertIndexToTime(val[1] + timeIdxOffset),
            })
          }}
          key={i}
        />
      ))}
    </Stack>
  )
}
