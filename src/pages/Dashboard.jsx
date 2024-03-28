import { LineChart } from '@mantine/charts';
import { BarChart } from '@mantine/charts';
import { Text } from '@mantine/core';

export function Dashboard() {
  const Employees = [
    { month: 'Jan', Expenditure: 2890, Workers: 139, Hours: 4709 },
    { month: 'Feb', Expenditure: 2700, Workers: 176, Hours: 1017 },
    { month: 'Mar', Expenditure: 3600, Workers: 228, Hours: 376 },
    { month: 'Apr', Expenditure: 2500, Workers: 232, Hours: 6922 },
    { month: 'May', Expenditure: null, Workers: null, Hours: null },
    { month: 'Jun', Expenditure: null, Workers: null, Hours: null },
    { month: 'Jul', Expenditure: null, Workers: null, Hours: null },
    { month: 'Aug', Expenditure: null, Workers: null, Hours: null },
    { month: 'Sep', Expenditure: null, Workers: null, Hours: null },
    { month: 'Oct', Expenditure: null, Workers: null, Hours: null },
    { month: 'Nov', Expenditure: null, Workers: null, Hours: null },
    { month: 'Dec', Expenditure: null, Workers: null, Hours: null },
  ];

  const monthlyBookings = [
    { month: 'Jan', Bookings: 46 },
    { month: 'Feb', Bookings: 29 },
    { month: 'Mar', Bookings: 60 },
    { month: 'Apr', Bookings: 47 },
    { month: 'May', Bookings: null },
    { month: 'Jun', Bookings: null },
    { month: 'Aug', Bookings: null },
    { month: 'Sep', Bookings: null },
    { month: 'Oct', Bookings: null },
    { month: 'Nov', Bookings: null },
    { month: 'Dec', Bookings: null },
  ];

  return (
    <>

      <div style={{ textAlign: 'center' }}>
        <Text mb="md" pl="md" style={{ fontWeight: 'bold', fontSize: '24px' }}>
          Dashboard
        </Text>
      </div>

      <Text mb="md" pl="md" style={{ fontWeight: 'bold', fontSize: '16px' }}> 
        Monthly Hiring Expenditure:
      </Text>
    
      <LineChart
        h={300}
        data={Employees}
        dataKey="month"
        xAxisLabel="Date"
        yAxisLabel="Expenditure"
        xAxisProps={{ padding: { left: 30, right: 30 } }}
        series={[
          { name: "Expenditure", color: 'rgb(47, 173, 102)' },
        ]}
        curveType="linear"
        tickLine="xy"
        connectNulls="false"
      />

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

      <Text mb="md" pl="md" style={{ fontWeight: 'bold', fontSize: '16px' }}>
        Working Hours:
      </Text>

    </>
  );
}