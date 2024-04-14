import { Grid, Text, Box, GridCol, Divider } from "@mantine/core"
import React, { useEffect, useMemo, useRef, useState } from "react"
import "react-range-slider-input/dist/style.css"
import "./schedule.css"
import { DoW, DoWShort, hours } from "../../types/constants"
import { DayTimeline } from "./DayTimeline"

export const WeeklySchedule = React.forwardRef<HTMLDivElement>((props, ref) => {
  const sidebarCols = 2
  const ncols = sidebarCols + hours.length * 2
  const minColWidth = 64
  const tickers = useMemo(() => [...hours, "10pm"], [hours])
  const [colWidth, setColWidth] = useState(0)
  const colRef = useRef<HTMLDivElement>()

  useEffect(() => {
    const handleResize = () => {
      setColWidth(colRef.current.offsetWidth)
    }
    handleResize()
    window.addEventListener("resize", handleResize) // change the offset width whenever the window width changes
    return () => { window.removeEventListener("resize", handleResize)}
  }, [])

  return (
    <Grid
      ref={ref}
      columns={ncols}
      pr="xl"
      pb="md"
      gutter={{ base: 5 }}
      style={{ overflowX: "hidden", minWidth: `${hours.length * minColWidth}px` }}
    >
      {tickers.map((hr, i) => (
        <GridCol key={i} span={2} style={{ textAlign: "center" }} className="hour-col">
          <Text style={{ transform: `translateX(${colWidth / ncols}px)` }}>{hr}</Text>
        </GridCol>
      ))}

      <GridCol ref={colRef} span={ncols}>
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

          <GridCol pr="4px" span={hours.length * 2} style={{ borderRight: "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-gray-8))"}}>
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
})
