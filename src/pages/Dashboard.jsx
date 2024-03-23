import React, { useEffect, useRef} from 'react';
import Chart from 'chart.js/auto';

export function Dashboard() {
  const chartContainer1 = useRef(null);
  const chartContainer2 = useRef(null);
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);

  useEffect(() => {
    const ctx1 = chartContainer1.current.getContext('2d');
    const ctx2 = chartContainer2.current.getContext('2d');

    const hiringExpenditure = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: 'Monthly Hiring Expenditure (in Thousands)',
          data: [10, 12.5, 13, 17],
          borderColor: 'rgb(47, 173, 102)',
          borderWidth: 2,
          fill: true,
        },
      ],
    };

    const monthlyBookings = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: 'Number of Monthly Bookings',
          data: [976, 2757, 3951, 1327],
          borderColor: 'rgb(47, 173, 102)',
          borderWidth: 2,
          fill: true,
        },
      ],
    };

    chartRef1.current = new Chart(ctx1, {
      type: 'line',
      data: hiringExpenditure,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                weight: 'bold' // Set font weight to bold for y-axis ticks
              }
            }
          },
          x: {
            ticks: {
              font: {
                weight: 'bold' // Set font weight to bold for x-axis ticks
              }
            }
          }
        },
      },
    });

    chartRef2.current = new Chart(ctx2, {
      type: 'line',
      data: monthlyBookings,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                weight: 'bold' // Set font weight to bold for y-axis ticks
              }
            }
          },
          x: {
            ticks: {
              font: {
                weight: 'bold' // Set font weight to bold for x-axis ticks
              }
            }
          }
        },
      },
    });

    return () => {
      if (chartRef1.current) {
        chartRef1.current.destroy(); // Cleanup previous chart instance on component unmount
      }
      if (chartRef2.current) {
        chartRef2.current.destroy(); // Cleanup previous chart instance on component unmount
      }
    };

  }, []);

  return (
    <div style = {{ textAlign: 'center'}}>
      <h1>Dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <h3 style={{ fontWeight: 'bold' }}>Monthly Hiring Expenditure</h3>
          <canvas ref={chartContainer1} width="400" height="200"></canvas>
        </div>
        <div>
          <h3 style={{ fontWeight: 'bold' }}>Number of Monthly Bookings</h3>
          <canvas ref={chartContainer2} width="400" height="200"></canvas>
        </div>
      </div>
    </div>
  );
}