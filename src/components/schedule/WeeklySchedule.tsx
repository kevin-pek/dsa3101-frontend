import { Grid, Text, Box, GridCol, Divider } from "@mantine/core"
import React from "react"
import "react-range-slider-input/dist/style.css"
import "./schedule.css"
import { useSchedules } from "../../hooks/use-schedules"
import { DoW, hours } from "../../types/constants"
import { DayTimeline } from "./DayTimeline"

export const WeeklySchedule = ({ schedule, setSchedule }) => {
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

      {Object.values(DoW).map((day, i) => (
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
            <DayTimeline
              schedule={schedule.filter((sched) => sched.day === day)}
              setSchedule={setSchedule}
            />
          </GridCol>

          {i !== Object.values(DoW).length - 1 && (
            <GridCol span={cols}>
              <Divider />
            </GridCol>
          )}
        </React.Fragment>
      ))}
    </Grid>
  )
}
