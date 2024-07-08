import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BarChart({ endpoint, title }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: title,
      data: [],
      backgroundColor: 'rgba(207, 159, 255, 0.4)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  });

  useEffect(() => {
    fetch(`http://localhost:8000/public/index.php?data=${endpoint}`)
      .then(response => response.json())
      .then(data => {
        setChartData({
          labels: Object.keys(data),
          datasets: [{
            label: title,
            data: Object.values(data),
            backgroundColor: '#FFB6C1',
            borderColor: '#f41e74',
            borderWidth: 1
          }]
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [endpoint, title]);

  return (
    <div style={{
        margin: '60px 0',
        width: '350px',
        height: '300px',
        backgroundColor: '#3d3935',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 4px rgba(255, 255, 255, 0.1)'}}>
      <div style={{ width: '300px', height: '300px' }}>
        <h3 style={{ padding: '5px 50px', color: '#f41e74' }}>{title}</h3>
        <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />
      </div>
    </div>
  );
}

export default BarChart;
