import { LineChart, BarChart, AreaChart, RadarChart } from "@mantine/charts"
import { Text, Grid, Paper, Group, Container } from "@mantine/core"
import { IconCoin, IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react"
import {
  empAvailability,
  hiringExpenditure,
  empRoles,
  hoursWorked,
  weeklyBookings,
  monthlyBookings,
  demandForecast,
} from "../sampleDashboard.jsx"
import Dropdown from "../components/Dropdown.jsx"
import DemandModal from "../components/DemandModal.jsx"
import DateRange from "../components/DateRange.jsx"
import "../components/dropdown.css"
import { useState } from "react"
import "@mantine/charts/styles.css"

export function Dashboard() {
  const [selectedView, setSelectedView] = useState("Monthly") //Default state/view to be weekly
  const [value, setValue] = useState(null)
  const cost = 1000
  const diff = -10
  const DiffIcon = diff > 0 ? IconArrowUpRight : IconArrowDownRight
  //Define chart components for each view type
  const viewCharts = {
    Weekly: {
      chart1: (
        <div>
          <div style={{ textAlign: "center" }}>
            <Text mb="md" pl="md" style={{ fontWeight: "bold", fontSize: "24px" }}>
              Weekly Employee Statistics
            </Text>
          </div>

          <div style={{ padding: "20px" }}>
            <Text mb="md" pl="md" style={{ fontWeight: "bold", fontSize: "16px" }}>
              Weekly Employee Availability:
            </Text>

            <BarChart
              h={300}
              data={empAvailability}
              dataKey="day"
              type="stacked"
              xAxisLabel="Day"
              orientation="vertical"
              xAxisProps={{ padding: { left: 30, right: 30 } }}
              //withLegend
              //legendProps={{ horizontalAlign: 'bottom', height: 5 }}
              withTooltip={true}
              series={[
                { name: "PartTime", color: "#2FAD66" },
                { name: "FullTime", color: "#F29204" },
              ]}
              tickLine="y"
            />
          </div>
        </div>
      ),

      chart2: (
        <div>
          <div style={{ textAlign: "center" }}>
            <Text mb="md" pl="md" style={{ fontWeight: "bold", fontSize: "24px" }}>
              Weekly Demand Statistics
            </Text>
          </div>

          <div style={{ padding: "20px" }}>
            <Text mb="md" pl="md" style={{ fontWeight: "bold", fontSize: "16px" }}>
              Number of Weekly Bookings (by Day):
            </Text>

            <RadarChart
              h={300}
              data={weeklyBookings}
              dataKey="day"
              series={[{ name: "Bookings", color: "rgb(47, 173, 102)", opacity: 0.2 }]}
              withPolarGrid
              withPolarAngleAxis
              withPolarRadiusAxis
            />
          </div>
        </div>
      ),
    },

    Monthly: {
      chart1: (
        <div>
          <div style={{ textAlign: "center" }}>
            <Text mb="md" pl="md" style={{ fontWeight: "bold", fontSize: "24px" }}>
              Monthly Employee Statistics
            </Text>
          </div>

          <div style={{ padding: "20px" }}>
            <Text mb="md" pl="md" style={{ fontWeight: "bold", fontSize: "16px" }}>
              Current Number of Staff Employed (by Month, Role):
            </Text>

            <BarChart
              h={300}
              data={empRoles}
              dataKey="month"
              type="stacked"
              xAxisLabel="Day"
              orientation="vertical"
              xAxisProps={{ padding: { left: 30, right: 30 } }}
              //withLegend
              //legendProps={{ layout: 'horizontal', verticalAlign: 'top' }}
              withTooltip={true}
              series={[
                { name: "Manager", color: "#F29204" },
                { name: "Chef", color: "#2FAD66" },
                { name: "Cashier", color: "#116732" },
              ]}
              tickLine="y"
            />
          </div>
        </div>
      ),

      chart2: (
        <div style={{ padding: "20px" }}>
          <Text mb="md" pl="md" style={{ fontWeight: "bold", fontSize: "16px" }}>
            Monthly Breakdown of Hours Worked (Combined Total):
          </Text>

          <AreaChart
            h={300}
            data={hoursWorked}
            dataKey="month"
            series={[
              { name: "Manager", color: "#F29204" },
              { name: "Chef", color: "#116732" },
              { name: "Cashier", color: "#2FAD66" },
            ]}
            curveType="linear"
          />
        </div>
      ),

      chart3: (
        <div>
          <div style={{ textAlign: "center" }}>
            <Text mb="md" pl="md" style={{ fontWeight: "bold", fontSize: "24px" }}>
              Monthly Expenditure Statistics
            </Text>
          </div>

          <div style={{ padding: "20px" }}>
            <Text mb="md" pl="md" style={{ fontWeight: "bold", fontSize: "16px" }}>
              Monthly Hiring Expenditure (Combined Total):
            </Text>

            <LineChart
              h={300}
              data={hiringExpenditure}
              dataKey="month"
              yAxisLabel="Expenditure"
              xAxisProps={{ padding: { left: 30, right: 30 } }}
              xAxisLabel="Date"
              series={[{ name: "Total", color: "rgb(47, 173, 102)" }]}
              curveType="linear"
              tickLine="xy"
              connectNulls="false"
            />
          </div>
        </div>
      ),

      chart4: (
        <div style={{ padding: "20px" }}>
          <Text mb="md" pl="md" style={{ fontWeight: "bold", fontSize: "16px" }}>
            Monthly Hiring Expenditure Breakdown (by Role):
          </Text>

          <AreaChart
            h={300}
            data={hiringExpenditure}
            dataKey="month"
            xAxisProps={{ padding: { left: 30, right: 30 } }}
            withTooltip={true}
            series={[
              { name: "Manager", color: "#F29204" },
              { name: "Chef", color: "#2FAD66" },
              { name: "Cashier", color: "#116732" },
            ]}
            curveType="linear"
          />
        </div>
      ),

      chart5: (
        <div style={{ padding: "20px" }}>
          <Text mb="md" pl="md" style={{ fontWeight: "bold", fontSize: "16px" }}>
            Monthly Hiring Expenditure Breakdown (by Occasion):
          </Text>

          <AreaChart
            h={300}
            data={hiringExpenditure}
            dataKey="month"
            xAxisProps={{ padding: { left: 30, right: 30 } }}
            withTooltip={true}
            series={[
              { name: "Weekday", color: "#F29204" },
              { name: "Weekend", color: "#2FAD66" },
              { name: "PH", color: "#116732" },
            ]}
            curveType="linear"
          />
        </div>
      ),

      chart6: (
        <div>
          <div style={{ textAlign: "center" }}>
            <Text mb="md" pl="md" style={{ fontWeight: "bold", fontSize: "24px" }}>
              Monthly Demand Statistics
            </Text>
          </div>

          <div style={{ padding: "20px" }}>
            <Text mb="md" pl="md" style={{ fontWeight: "bold", fontSize: "16px" }}>
              Monthly Number of Bookings:
            </Text>

            <LineChart
              h={300}
              data={monthlyBookings}
              dataKey="month"
              xAxisProps={{ padding: { left: 30, right: 30 } }}
              series={[{ name: "Bookings", color: "rgb(47, 173, 102)" }]}
              curveType="linear"
              tickLine="xy"
              connectNulls="false"
            />
          </div>
        </div>
      ),

      chart7: (
        <div style={{ padding: "20px" }}>
          <Text mb="md" pl="md" style={{ fontWeight: "bold", fontSize: "16px" }}>
            Monthly Customer Demand Forecast:
          </Text>

          <LineChart
            h={300}
            data={demandForecast}
            dataKey="date"
            xAxisProps={{ padding: { left: 30, right: 30 } }}
            series={[{ name: "Customers", color: "rgb(47, 173, 102)" }]}
            curveType="linear"
            tickLine="xy"
            connectNulls="false"
          />
        </div>
      ),
    },

    Yearly: {
      chart1: <p>Add chart here</p>,
    },
  }

  return (
    <>
      <Container fluid style={{ padding: "1rem" }}>
        <Grid grow>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
          <Grid.Col span={4} style={{ justifyContent: "bottom", alignItems: "bottom"}}>
            <Dropdown selected={selectedView} setSelected={setSelectedView} />
          </Grid.Col>
          <Grid.Col span={4} style={{ justifyContent: "bottom", alignItems: "bottom" }}>
            <DateRange />
          </Grid.Col>
          <Grid.Col span={4} style={{ justifyContent: "bottom", alignItems: "bottom" }}>
              <DemandModal />
          </Grid.Col>
          </div>

          <Grid.Col span={{ base: 12 }}>
            <Paper
              withBorder
              shadow="xs"
              p="xl"
              style={{ justifyContent: "center", alignItems: "center", height: "100%" }}
            >
              <Group justify="space-between">
                <Text size="md" c="dimmed" fw={700}>
                  Projected Cost
                </Text>
                <IconCoin size="1.4rem" stroke={1.5} />
              </Group>
              <Group align="flex-end" gap="xs" mt={25}>
                <Text size="lg">{cost}</Text>
                <Text c={diff > 0 ? "teal" : "red"} fz="sm" fw={500}>
                  <span>{diff}%</span>
                  <DiffIcon size="1rem" stroke={1.5} />
                </Text>
              </Group>
              <Text fz="md" c="dimmed" mt={8}>
                based on currently shown schedule
              </Text>
            </Paper>
          </Grid.Col>

          {/* Group 1 and 2 */}
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Paper withBorder shadow="xs" p="xl">
              <div>{viewCharts[selectedView].chart1}</div>
            </Paper>
            <Paper withBorder shadow="xs" p="xl">
              <div>{viewCharts[selectedView].chart2}</div>
            </Paper>
          </Grid.Col>

          {/* Group 6 and 7 */}
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Paper withBorder shadow="xs" p="xl">
              <div>{viewCharts[selectedView].chart6}</div>
            </Paper>
            <Paper withBorder shadow="xs" p="xl">
              <div>{viewCharts[selectedView].chart7}</div>
            </Paper>
          </Grid.Col>

          {/* Group 3, 4, 5 */}
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Paper withBorder shadow="xs" p="xl">
              <div>{viewCharts[selectedView].chart3}</div>
            </Paper>
            <Paper withBorder shadow="xs" p="xl">
              <div>{viewCharts[selectedView].chart4}</div>
            </Paper>
            <Paper withBorder shadow="xs" p="xl">
              <div>{viewCharts[selectedView].chart5}</div>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  )
}
