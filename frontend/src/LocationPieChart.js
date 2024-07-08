import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function LocationPieChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Completed Surveys by Location',
      data: [],
      backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#c9cbcf'],
      hoverOffset: 4
    }]
  });

  useEffect(() => {
    fetch('http://localhost:8000/public/index.php?data=completedSurveysByLocation')
      .then(response => response.json())
      .then(data => {
        const locations = Object.keys(data);
        const completedCounts = locations.map(location => data[location]);

        setChartData({
          labels: locations,
          datasets: [{
            label: 'Completed Surveys by Location',
            data: completedCounts,
            backgroundColor: ['#FF69B4', '#FFB6C1', '#FFD7E9', '#FFC0CB', '#FF8096', '#FF4162', '#E80074', '#A90054', '#FFA6C9'],
            hoverOffset: 4
          }]
        });
      })
      .catch(error => console.error('Error fetching completed survey data:', error));
  }, []);

  return (
    <div style={{
        position: 'absolute',
        right: '30px',
        paddingBottom: '10px',
        top: '1000px',
        width: '50%',
        maxWidth: '350px',
        backgroundColor: '#3d3935',
        borderRadius: '10px',
        marginRight: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        boxShadow: '0 4px 4px rgba(255, 255, 255, 0.1)'
      }}>
      <h3 style={{ padding: '0 80px', marginBottom: '20px', color: '#f41e74' }}>Surveys by Location</h3>
      <Pie data={chartData} options={{ maintainAspectRatio: true }} />
    </div>
  );
}

export default LocationPieChart;
