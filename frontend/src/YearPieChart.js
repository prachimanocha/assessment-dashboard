import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function YearPieChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Completed Surveys by Start Year',
      data: [],
      backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#c9cbcf', '#86c7f3', '#ffd700'],
      hoverOffset: 4
    }]
  });

  useEffect(() => {
    fetch('http://localhost:8000/public/index.php?data=completedSurveysByYear')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const years = Object.keys(data);
        const counts = Object.values(data);

        setChartData({
          labels: years,
          datasets: [{
            label: 'Completed Surveys by Start Year',
            data: counts,
            backgroundColor: [
             '#FF69B4', '#FFB6C1', '#FFD7E9', '#FFC0CB', '#FF8096', '#FF4162', '#E80074', '#A90054', '#FFA6C9'
            ],
            hoverOffset: 4
          }]
        });
      })
      .catch(error => console.error('Error fetching year data:', error));
  }, []);

  return (
    <div style={{
        position: 'absolute',
        left: '30px',
        top: '1000px', // Adjusted to avoid overlap if multiple charts are displayed
        width: '50%',
        maxWidth: '350px',
        height: 'auto',
        backgroundColor: '#3d3935',
        borderRadius: '10px',
        marginLeft: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingBottom:'10px',
        justifyContent: 'center',
        boxShadow: '0 4px 4px rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{  padding: '0 75px', marginBottom: '20px', color: '#f41e74' }}>Surveys by Start Year</h3>
        <Pie data={chartData} options={{ maintainAspectRatio: true }} />
      </div>
  );
}

export default YearPieChart;
