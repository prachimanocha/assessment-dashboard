import React, { useState } from 'react';
import './Filter.css';
import DoughnutChartComponent from './DoughnutChartComponent';
import DeptPieChart from './DeptPieChart';
import BarChart from './BarChart';
import Heatmap from './Heatmap';
import CorrelationTable from './CorrelationTable';
import LocationPieChart from './LocationPieChart';
import YearPieChart from './YearPieChart';
import SentimentBarChart from './SentimentBarChart';  
import HorizontalBarChart from './HorizontalBarChart';
import SentimentFilterBarChart from './SentimentFilterBarChart';
// import words from "./words";
import Filter from './Filter';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
import WordCloudComponent from './WordCloudComponent';
import { transformSentencesToWordCloudData } from './transformData';
import sentences from './sentences';


const wordCloudData = transformSentencesToWordCloudData(sentences);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const App = () => {
  const [filters, setFilters] = useState({
    location: '',
    department: '',
    year: '',
  });

  const [showHeatmap, setshowHeatmap] = useState(false);

  const handleFilterChange = (filterType, filterValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: filterValue,
    }));
  };

  const applyFilter = () => {
    setshowHeatmap(true);
  };

  const clearFilter = () => {
    setFilters({
      location: '',
      department: '',
      year: '',
    });
    setshowHeatmap(false);
  };

  const selectedFilters = Object.entries(filters).filter(([key, value]) => value);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <header>
        <div className="logo">
          <img src="happiness.png" alt="The Happiness Index" />
        </div>
        <h2>CULTURAL ASSESSMENT DASHBOARD</h2>
        <div>
          <span className="circle">P</span>
          <span className="nav__logo-name">Prachi</span>
        </div>
      </header>
      <Filter onFilterChange={handleFilterChange} applyFilter={applyFilter} />
{showHeatmap ? (
  <div>
    <button className="filterbutton" onClick={clearFilter}>Clear Filter</button>
    <Heatmap filters={filters} />
    <div className='container-chart'>
      {selectedFilters.length === 3 ? (
        <div className="doughnut-row">
          {selectedFilters.map(([filterType, filterValue]) => (
            <div className="doughnut-chart" key={filterType}>
              <DoughnutChartComponent filterType={filterType} filterValue={filterValue} />
              <HorizontalBarChart filterType={filterType} filterValue={filterValue} />
              <SentimentFilterBarChart filterType={filterType} filterValue={filterValue} />
            </div>
          ))}
        </div>
      ) : (
        selectedFilters.map(([filterType, filterValue]) => (
          <div className="doughnut-chart" key={filterType}>
            <DoughnutChartComponent filterType={filterType} filterValue={filterValue} />
            <HorizontalBarChart filterType={filterType} filterValue={filterValue} />
            <SentimentFilterBarChart filterType={filterType} filterValue={filterValue} />
          </div>
        ))
      )}
    </div>
  </div>
) : (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', width: '100%' }}>
    <WordCloudComponent data={wordCloudData} />
    <BarChart endpoint="locationScores" title="Scores by Location" />
    <BarChart endpoint="departmentScores" title="Scores by Department" />
    <BarChart endpoint="yearScores" title="Scores by Start Year" />
    <DeptPieChart />
    <LocationPieChart />
    <YearPieChart />
    <SentimentBarChart />
    <CorrelationTable />
  </div>
)}
</div>

  );
};

export default App;