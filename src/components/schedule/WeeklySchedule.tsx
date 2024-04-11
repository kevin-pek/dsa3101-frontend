import { Grid, Text, Box, GridCol, Divider } from "@mantine/core"
import React from "react"
import "react-range-slider-input/dist/style.css"
import "./schedule.css"
import { DoW, DoWShort, hours } from "../../types/constants"
import { DayTimeline } from "./DayTimeline"

export const WeeklySchedule = () => {
  const sidebarCols = 3
  const ncols = sidebarCols + hours.length * 2
  const minColWidth = 64

  return (
    <Grid
      columns={ncols}
      py="lg"
      px="sm"
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

      <GridCol span={ncols}>
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
            <Text size="lg">{Object.values(DoWShort)[i]}</Text>
            <Divider orientation="vertical" />
          </GridCol>

          <GridCol span={hours.length * 2}>
            <DayTimeline day={day} />
          </GridCol>

          {/* Add spacer between the days of the week */}
          {i !== Object.values(DoW).length - 1 && (
            <GridCol span={ncols}>
              <Divider />
            </GridCol>
          )}
        </React.Fragment>
      ))}
    </Grid>
  )
}
