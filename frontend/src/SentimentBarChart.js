import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SentimentBarChart() {
  const [chartData, setChartData] = useState({
    labels: ['Neutral', 'Positive', 'Negative'],
    datasets: [{
      label: 'Sentiment Analysis',
      data: [0, 0, 0],  // Default values
      backgroundColor: ['#FFA9D4', '#FF69B4', '#FF2994']
    }]
  });

  useEffect(() => {
    fetch('http://localhost:8000/public/index.php?data=sentiments')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched Sentiment Data:', data);  // Debugging line
        const sentimentCounts = { Neutral: 0, Positive: 0, Negative: 0 };
        data.forEach(item => {
          const sentiment = item.sentiment.trim();
          if (sentiment === 'Neutral') sentimentCounts.Neutral++;
          if (sentiment === 'Positive') sentimentCounts.Positive++;
          if (sentiment === 'Negative') sentimentCounts.Negative++;
        });
        setChartData({
          labels: ['Neutral', 'Positive', 'Negative'],
          datasets: [{
            label: 'Sentiment Analysis',
            data: [sentimentCounts.Neutral, sentimentCounts.Positive, sentimentCounts.Negative],
            backgroundColor: ['#FFA9D4', '#FF69B4', '#FF2994']
          }]
        });
      })
      .catch(error => console.error('Error fetching sentiment data:', error));
  }, []);

  return (
    <div style={{
        position: 'absolute',
        left: '70px',
        top: '1500px', // Adjusted to avoid overlap if multiple charts are displayed
        width: '550px',
        height: 'auto',
        backgroundColor: '#3d3935',
        borderRadius: '10px',
        marginRight: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingLeft: '10px',
        paddingBottom: '10px',
        justifyContent: 'center',
        boxShadow: '0 4px 4px rgba(255, 255, 255, 0.1)'}}>
      <h3 style={{padding: '0 120px', color: '#f41e74'}}>Sentiment Analysis Results</h3>
      <Bar data={chartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
    </div>
  );
}

export default SentimentBarChart;
