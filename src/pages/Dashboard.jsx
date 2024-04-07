import { LineChart, BarChart, AreaChart, RadarChart } from '@mantine/charts';
import { Text } from '@mantine/core';
import { empAvailability, hiringExpenditure, empRoles, hoursWorked, weeklyBookings, monthlyBookings, demandForecast } from '../sampleDashboard.jsx';
import Dropdown from '../components/Dropdown.jsx';
import '../components/dropdown.css';
import { useState } from 'react';

export function Dashboard() {

  const [selected, setSelected] = useState("");

  return (
    <>

      <div style={{ marginTop: '50px' }}>

        <Dropdown selected = {selected} setSelected = {setSelected} />

        <div style={{ textAlign: 'center' }}>
          <Text mb="md" pl="md" style={{ fontWeight: 'bold', fontSize: '30px' }}>
            Dashboard
          </Text>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Text mb="md" pl="md" style={{ fontWeight: 'bold', fontSize: '24px' }}>
          Employee Statistics
        </Text>
      </div>

      <div style={{ padding: '20px' }}>
      <Text mb="md" pl="md" style={{ fontWeight: 'bold', fontSize: '16px' }}>
        Weekly Employee Availability:
      </Text>

      <BarChart
        h={300}
        data={empAvailability}
        dataKey="day"
        type="stacked"
        xAxisLabel = "Day"
        orientation="vertical"
        xAxisProps={{ padding: { left: 30, right: 30 } }}
        //withLegend
        //legendProps={{ horizontalAlign: 'bottom', height: 5 }}
        withTooltip={true}
        series={[
          { name: 'PartTime', color: '#2FAD66' },
          { name: 'FullTime', color: '#F29204' },
        ]}
        tickLine="y"
      />

      </div>

      <div style={{ padding: '20px' }}>
      <Text mb="md" pl="md" style={{ fontWeight: 'bold', fontSize: '16px' }}>
        Current Number of Staff Employed (by Month, Role):
      </Text>

      <BarChart
        h={300}
        data={empRoles}
        dataKey="month"
        type="stacked"
        xAxisLabel = "Day"
        orientation="vertical"
        xAxisProps={{ padding: { left: 30, right: 30 } }}
        //withLegend
        //legendProps={{ layout: 'horizontal', verticalAlign: 'top' }}
        withTooltip={true}
        series={[
          { name: 'Manager', color: '#F29204' },
          { name: 'Chef', color: '#2FAD66' },
          { name: 'Cashier', color: '#116732' },
        ]}
        tickLine="y"
      />

      </div>

      <div style={{ padding: '20px' }}>
      <Text mb="md" pl="md" style={{ fontWeight: 'bold', fontSize: '16px' }}>
        Monthly Breakdown of Hours Worked (Combined Total):
      </Text>

      <AreaChart
      h={300}
      data={hoursWorked}
      dataKey="month"
      series={[
        { name: 'Manager', color: '#F29204' },
        { name: 'Chef', color: '#116732' },
        { name: 'Cashier', color: '#2FAD66' },
      ]}
      curveType="linear"
      />

      </div>

      <div style={{ textAlign: 'center' }}>
        <Text mb="md" pl="md" style={{ fontWeight: 'bold', fontSize: '24px' }}>
          Expenditure Statistics
        </Text>
      </div>

      <div style={{ padding: '20px' }}>
      <Text mb="md" pl="md" style={{ fontWeight: 'bold', fontSize: '16px' }}> 
        Monthly Hiring Expenditure (Combined Total):
      </Text>
    
      <LineChart
        h={300}
        data={hiringExpenditure}
        dataKey="month"
        yAxisLabel="Expenditure"
        xAxisProps={{ padding: { left: 30, right: 30 } }}
        xAxisLabel="Date"
        series={[
          { name: "Total", color: 'rgb(47, 173, 102)' },
        ]}
        curveType="linear"
        tickLine="xy"
        connectNulls="false"
      />

      </div>

      <div style={{ padding: '20px' }}>
      <Text mb="md" pl="md" style={{ fontWeight: 'bold', fontSize: '16px' }}> 
        Monthly Hiring Expenditure Breakdown (by Role):
      </Text>

      </div>
      <AreaChart
        h={300}
        data={hiringExpenditure}
        dataKey="month"
        xAxisProps={{ padding: { left: 30, right: 30 } }}
        withTooltip={true}
        series={[
          { name: 'Manager', color: '#F29204' },
          { name: 'Chef', color: '#2FAD66' },
          { name: 'Cashier', color: '#116732' },
        ]}
        curveType = "linear"
      />

      <br></br>

      <div style={{ textAlign: 'center' }}>
        <Text mb="md" pl="md" style={{ fontWeight: 'bold', fontSize: '24px' }}>
          Demand Statistics
        </Text>
      </div>

      <div style={{ padding: '20px' }} >
      <Text mb="md" pl="md" style={{ fontWeight: 'bold', fontSize: '16px' }}>
        Weekly Bookings:
      </Text>

      <RadarChart
      h={300}
      data={weeklyBookings}
      dataKey="day"
      series={[{ name: 'Bookings', color: 'rgb(47, 173, 102)', opacity: 0.2 }]}
      withPolarGrid
      withPolarAngleAxis
      withPolarRadiusAxis
      />

      </div>

      <div style={{ padding: '20px' }} >
      <Text mb="md" pl="md" style={{ fontWeight: 'bold', fontSize: '16px' }}>
        Monthly Bookings:
      </Text>

      <LineChart
        h={300}
        data={monthlyBookings}
        dataKey="month"
        xAxisProps={{ padding: { left: 30, right: 30 } }}
        series={[
          { name: 'Bookings', color: 'rgb(47, 173, 102)' },
        ]}
        curveType="linear"
        tickLine="xy"
        connectNulls="false"
      />

      </div>
      
      <div style={{ padding: '20px' }}>
      <Text mb="md" pl="md" style={{ fontWeight: 'bold', fontSize: '16px' }}>
        Monthly Customer Demand Forecast:
      </Text>

      <LineChart
        h={300}
        data={demandForecast}
        dataKey="date"
        xAxisProps={{ padding: { left: 30, right: 30 } }}
        series={[
          { name: 'Customers', color: 'rgb(47, 173, 102)' },
        ]}
        curveType="linear"
        tickLine="xy"
        connectNulls="false"
      />
      
      </div>

      </div>

    </>
  );
}