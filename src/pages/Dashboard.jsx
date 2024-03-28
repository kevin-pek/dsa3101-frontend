import { LineChart } from '@mantine/charts';
import { BarChart } from '@mantine/charts';
import { Text } from '@mantine/core';
import { Employees, monthlyBookings, empAvailability, demandForecast } from '../sampleDashboard.jsx';

export function Dashboard() {

  return (
    <>

      <div style={{ textAlign: 'center' }}>
        <Text mb="md" pl="md" style={{ fontWeight: 'bold', fontSize: '24px' }}>
          Dashboard
        </Text>
      </div>

      <div style={{ padding: '20px' }}>
      <Text mb="md" pl="md" style={{ fontWeight: 'bold', fontSize: '16px' }}> 
        Monthly Hiring Expenditure:
      </Text>
    
      <LineChart
        h={300}
        data={Employees}
        dataKey="month"
        yAxisLabel="Expenditure"
        xAxisProps={{ padding: { left: 30, right: 30 } }}
        xAxisLabel="Date"
        series={[
          { name: "Expenditure", color: 'rgb(47, 173, 102)' },
        ]}
        curveType="linear"
        tickLine="xy"
        connectNulls="false"
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
        Employee Availability:
      </Text>

      <BarChart
        h={300}
        data={empAvailability}
        dataKey="day"
        type="stacked"
        xAxisLabel = "Day"
        orientation="vertical"
        xAxisProps={{ padding: { left: 30, right: 30 } }}
        withLegend
        legendProps={{ layout: 'horizontal', verticalAlign: 'top' }}
        withTooltip={true}
        series={[
          { name: 'PT', color: '#116732' },
          { name: 'FT', color: '#2FAD66' },
        ]}
        tickLine="y"
      />

      </div>
      

      <div style={{ padding: '20px' }}>
      <Text mb="md" pl="md" style={{ fontWeight: 'bold', fontSize: '16px' }}>
        Customer Demand Forecast:
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

    </>
  );
}