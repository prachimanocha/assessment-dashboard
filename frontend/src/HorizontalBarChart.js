import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const HorizontalBarChart = ({ filterType, filterValue }) => {
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/public/index.php?data=questionScores&${filterType}=${filterValue}`);
                const data = await response.json();
                if (data) {
                    setChartData({
                        labels: Object.keys(data),
                        datasets: [{
                            label: 'Average Score by Question',
                            data: Object.values(data),
                            backgroundColor: 'rgba(250, 160, 160, 0.5)',
                            borderColor: 'rgba(248, 200, 220, 1)',
                            borderWidth: 1,
                        }]
                    });
                } else {
                    setError('No data available');
                }
            } catch (error) {
                console.error('Error fetching question scores:', error);
                setError('Error fetching data');
            }
        };

        fetchData();
    }, [filterType, filterValue]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={{
            width: '444px',
            height: '400px',
            flex: '1',
            margin: '0',
            padding: '0',
            marginTop: '60px',
            backgroundColor: '#3d3935',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 4px rgba(255, 255, 255, 0.1)',
        }}>
            <h4 style={{ paddingLeft: '80px', color: '#f41e74' }}>
                {`Question Scores for ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}: ${filterValue}`}
            </h4>
            {chartData ? (
                <Bar data={chartData} options={{ indexAxis: 'y' }} />
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default HorizontalBarChart;
