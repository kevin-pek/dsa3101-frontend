import React from "react"
import { Select } from "@mantine/core"
import { IconSelect } from "@tabler/icons-react"
import { AreaChart, BarChart, LineChart, RadarChart } from "@mantine/charts"
import {
  demand,
  empAvailability,
  empRoles,
  hiringExpenditure,
  hoursWorked,
  monthlyBookings,
  weeklyBookings,
} from "../sampleDashboard"

function Dropdown({ selected, setSelected }) {
  const options = [
    { value: "Weekly", label: "Weekly" },
    { value: "Monthly", label: "Monthly" },
    { value: "Yearly", label: "Yearly" },
  ]

  return (
    <Select
      value={selected}
      onChange={setSelected}
      data={options}
      label="Current Selected View"
      placeholder="Select option"
      width={200}
    />
  )
}

export default Dropdown

//Define chart components for each view type
export const viewCharts = {
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
            orientation="vertical"
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
            orientation="vertical"
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
            series={[{ name: "Total", color: "rgb(47, 173, 102)" }]}
            curveType="linear"
            tickLine="xy"
            connectNulls={false}
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
            connectNulls={false}
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
          data={demand}
          dataKey="date"
          xAxisProps={{ padding: { left: 30, right: 30 } }}
          series={[{ name: "Customers", color: "rgb(47, 173, 102)" }]}
          curveType="linear"
          tickLine="xy"
          connectNulls={false}
        />
      </div>
    ),
  },

  Yearly: {
    chart1: <p>Add chart here</p>,
  },
}
