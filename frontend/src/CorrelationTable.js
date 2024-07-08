import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import './CorrelationTable.css'; // Make sure to create and import this CSS file for styling

function CorrelationTable() {
  const [correlationData, setCorrelationData] = useState([]);

  useEffect(() => {
    Axios.get('http://localhost:8000/public/index.php?data=questionCorrelations')
      .then(response => {
        const data = response.data;
        console.log('Data fetched:', data);

        const correlations = Object.entries(data).map(([question, correlation]) => ({
          question,
          correlation: parseFloat(correlation) // Convert to number
        }));

        setCorrelationData(correlations);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const getBackgroundColor = (value) => {
    const alpha = Math.abs(value);
    if (value > 0) {
      return `rgba(244, 30 , 116, ${alpha})`; // Pink for positive correlations
    } else {
      return `rgba(0, 0, 0, ${alpha})`; // Black for negative correlations
    }
  };

  return (
    <div style={{
      position: 'absolute',
      right: '30px',
      top: '1500px',
      width: '50%',
      backgroundColor: '#3d3935',
      borderRadius: '10px',
      display: 'flex',
      padding: '0',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      boxShadow: '0 4px 4px rgba(255, 255, 255, 0.1)',
      height: '65%',
      margin: '0'
    }}>
      <h2 style={{ color: '#f41e74', margin: '0', paddingLeft: '220px' }}>Correlation of Questions</h2>
      <table className="correlation-table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Correlation</th>
          </tr>
        </thead>
        <tbody>
          {correlationData.map((item, index) => (
            <tr key={index}>
              <td>{item.question}</td>
              <td style={{ backgroundColor: getBackgroundColor(item.correlation) }}>
                {isNaN(item.correlation) ? 'N/A' : item.correlation.toFixed(2)} {/* Handle non-numeric values */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CorrelationTable;
