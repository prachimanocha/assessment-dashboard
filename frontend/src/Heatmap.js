import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import Axios from 'axios';

const generateColor = (value) => {
  const alpha = (value - 4) / 5;
  return `rgba(255, 182, 193, ${alpha})`; // RGB value for pink color
};

function Heatmap({ filters }) {
  const [heatmapData, setHeatmapData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    Axios.get('http://localhost:8000/public/index.php?data=heatmapData')
      .then(response => {
        const data = response.data;
        console.log('Data fetched:', data);

        const questions = Object.keys(data);
        const locations = filters.location ? [filters.location] : [];
        const departments = filters.department ? [filters.department] : [];
        const years = filters.year ? [filters.year] : [];

        const generateDatasets = (filterType, filterValues) => {
          return filterValues.map((value) => ({
            label: value,
            data: questions.map(question => data[question][value] || 0),
            backgroundColor: questions.map(question => generateColor(data[question][value] || 0)),
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1
          }));
        };

        const locationDatasets = generateDatasets('location', locations);
        const departmentDatasets = generateDatasets('department', departments);
        const yearDatasets = generateDatasets('year', years);

        const datasets = [...locationDatasets, ...departmentDatasets, ...yearDatasets];

        setHeatmapData({
          labels: questions,
          datasets: datasets
        });
      })
      .catch(error => console.error('Error fetching heatmap data:', error));
  }, [filters]);

  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
        }
      }
    },
    plugins: {
      datalabels: {
        display: true,
        color: 'black',
        align: 'center',
        formatter: (value) => {
          return value.toFixed(1);
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      },
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Heatmap of Question Scores',
        font: {
          size: 18,
        }
      }
    },
    responsive: true,
    maintainAspectRatio: true
  };

  return (
    <div style={{
      position: 'absolute',
      right: '55px',
      top: '1250px',
      backgroundColor: '#3d3935',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      boxShadow: '0 4px 4px rgba(255, 255, 255, 0.1)',
      width: '90%',
      height: '80%'
    }}>
      <h2 style={{ paddingLeft: '500px', color: '#f41e74', margin: '0' }}>Heatmap of Question Scores</h2>
      <Bar data={heatmapData} options={options} />
    </div>
  );
}

export default Heatmap;
