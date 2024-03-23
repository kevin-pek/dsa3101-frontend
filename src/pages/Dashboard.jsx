import React, { useEffect, useRef} from 'react';
import Chart from 'chart.js/auto';

export function Dashboard() {
  const chartContainer = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartContainer.current.getContext('2d');

    const hiringExpenditure = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: 'Monthly Hiring Expenditure (in Thousands)',
          data: [10, 12.5, 13, 17],
          borderColor: 'rgb(47, 173, 102)',
          borderWidth: 3,
          fill: true,
        },
      ],
    };

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: hiringExpenditure,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Cleanup previous chart instance on component unmount
      }
    };

  }, []);

  return (
    <div style = {{ padding: '20px', textAlign: 'center'}}>
      <h1>Dashboard</h1>
      <h3>2024 Monthly Hiring Expenditure</h3>
      <canvas ref={chartContainer} width="400" height="200"></canvas>
    </div>
  );
}