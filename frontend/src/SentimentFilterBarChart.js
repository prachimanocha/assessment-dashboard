import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SentimentFilterBarChart({ filterType, filterValue }) {
  const [chartData, setChartData] = useState({
    labels: ['Neutral', 'Positive', 'Negative'],
    datasets: [{
      label: 'Sentiment Analysis',
      data: [0, 0, 0],  // Default values
      backgroundColor: [ '#FFD7E9', '#FFC0CB', '#FF8096']
    }]
  });

  useEffect(() => {
    fetchSentimentData();
  }, [filterType, filterValue]); // Fetch data when filterType or filterValue changes

  const fetchSentimentData = () => {
    fetch(`http://localhost:8000/public/index.php?data=sentiments&${filterType}=${filterValue}`)
      .then(response => response.json())
      .then(data => {
        const sentimentCounts = { Neutral: 0, Positive: 0, Negative: 0 };
        if (!Array.isArray(data)) {
          throw new Error('Expected an array but got a different type');
        }
        data.forEach(item => {
          if (item.sentiment === 'Neutral') sentimentCounts.Neutral++;
          if (item.sentiment === 'Positive') sentimentCounts.Positive++;
          if (item.sentiment === 'Negative') sentimentCounts.Negative++;
        });
        setChartData({
          labels: ['Neutral', 'Positive', 'Negative'],
          datasets: [{
            label: 'Sentiment Analysis',
            data: [sentimentCounts.Neutral, sentimentCounts.Positive, sentimentCounts.Negative],
            backgroundColor: [ '#FFD7E9', '#FFC0CB', '#FF8096']
          }]
        });
      })
      .catch(error => console.error('Error fetching sentiment data:', error));
  };

  return (
    <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '400px',
        height: 'auto',
        backgroundColor: '#3d3935',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft:'40px',
        padding: '20px',
        marginTop:'50px',
        justifyContent: 'center',
        boxShadow: '0 4px 4px rgba(255, 255, 255, 0.1)'}}>
      {/* <h4 style={{ color: '#f41e74' }}>Sentiment Analysis Results</h4> */}
      <h4 style={{paddingLeft:'0',color:'#f41e74'}}> {`Sentiment Analysis for ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}: ${filterValue}`}</h4>
      <Bar data={chartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
    </div>
  );
}

export default SentimentFilterBarChart;
