import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const fetchData = async (query) => {
  const response = await fetch(`http://localhost:8000/public/index.php${query}`);
  return response.json();
};

const DoughnutChartComponent = ({ filterType, filterValue }) => {
  const [data, setData] = useState(null);
  const colors = {
    location: '#FF69B4', 
    department: '#FFB6C1',
    year: '#E37383',
  };

  useEffect(() => {
    let query = `?data=${filterType}Scores`;
    if (filterValue) query += `&${filterType}=${filterValue}`;

    fetchData(query)
      .then(data => {
        const label = filterValue || 'Average Score';
        const score = data[filterValue] || 0;
        setData({
          labels: [label],
          datasets: [
            {
              data: [score],
              backgroundColor: [colors[filterType]],
              hoverBackgroundColor: [colors[filterType]],
            },
          ],
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [filterType, filterValue]);

  const options = {
    plugins: {
      title: {
        display: true,
        text: `${filterType.charAt(0).toUpperCase() + filterType.slice(1)}: ${filterValue}`,
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.raw !== null) {
              label += context.raw.toFixed(2);
            }
            return label;
          }
        }
      },
    },
    maintainAspectRatio: true,
  };

  return data ? (
    <div style={{
      position: 'relative',
      width: '300px',
      height: '300px',
      paddingBottom: '10px',
      margin: '20px',
      backgroundColor: '#3d3935',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 4px rgba(255, 255, 255, 0.1)'
    }}>
      <Doughnut data={data} options={options} />
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default DoughnutChartComponent;
