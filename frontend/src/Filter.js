// // Filter.js
// import React from 'react';
// import './Filter.css';

// function Filter({ onFilterChange }) {
//   const handleCategoryChange = (event) => {
//     onFilterChange('category', event.target.value);
//   };

//   const handleLocationChange = (event) => {
//     onFilterChange('location', event.target.value);
//   };

//   const handleDepartmentChange = (event) => {
//     onFilterChange('department', event.target.value);
//   };

//   const handleYearChange = (event) => {
//     onFilterChange('year', event.target.value);
//   };

//   return (
//     <div className="filter-container">
//     <div className="dropdown">
//         <label htmlFor="location">Location:</label>
//         <select id="location" name="location">
//             <option value="0">Select Location</option>
//             <option value="1">Berlin</option>
//             <option value="2">London</option>
//             <option value="3">Mumbai</option>
//             <option value="4">New York</option>
//             <option value="5">Paris</option>
//             </select>
//     </div>

//     <div className="dropdown">
//         <label htmlFor="department">Department:</label>
//         <select id="department" name="department">
//             <option value="0">Select Department</option>
//             <option value="1">Brand</option>
//             <option value="2">HR</option>
//             <option value="3">Finance</option>
//             <option value="4">Sales</option>
//             <option value="5">Engine</option>
//             <option value="6">IT</option>
//             <option value="7">Marketing</option>
//             <option value="8">Customer</option>
//             <option value="9">Technology</option>
//         </select>
//     </div>

//     <div className="dropdown">
//         <label htmlFor="time-period">Time Period:</label>
//         <select id="time-period" name="time-period">
//             <option value="0">Select Time Period</option>
//             <option value="1">2015+Before</option>
//             <option value="2">2016-2017</option>
//             <option value="3">2018-2019</option>
//             <option value="4">2020-2021</option>
//         </select>
//     </div>
//     <button className="filter-button" type="submit">Filter</button>
// </div>
//   );
// }

// export default Filter;
import React from 'react';
import './Filter.css';

const Filter = ({ onFilterChange, applyFilter }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="filter-container">
      <div className="dropdown">
        <label htmlFor="location">Location:</label>
        <select id="location" name="location" onChange={handleFilterChange}>
          <option value="">Select Location</option>
          <option value="Berlin">Berlin</option>
          <option value="London">London</option>
          <option value="Mumbai">Mumbai</option>
          <option value="New York">New York</option>
          <option value="Paris">Paris</option>
        </select>
      </div>

      <div className="dropdown">
        <label htmlFor="department">Department:</label>
        <select id="department" name="department" onChange={handleFilterChange}>
          <option value="">Select Department</option>
          <option value="Brand">Brand</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Sales">Sales</option>
          <option value="Engine">Engine</option>
          <option value="IT">IT</option>
          <option value="Marketing">Marketing</option>
          <option value="Customer">Customer</option>
          <option value="Technology">Technology</option>
        </select>
      </div>

      <div className="dropdown">
        <label htmlFor="time-period">Time Period:</label>
        <select id="time-period" name="year" onChange={handleFilterChange}>
          <option value="">Select Time Period</option>
          <option value="2015+Before">2015+Before</option>
          <option value="2016-2017">2016-2017</option>
          <option value="2018-2019">2018-2019</option>
          <option value="2020-2021">2020-2021</option>
        </select>
      </div>
      <button className="filter-button" type="button" onClick={applyFilter}>Filter</button>
    </div>
  );
};

export default Filter;
