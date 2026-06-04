import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Weather from './components/weather';
import Hourly from './components/hourly';
import Precipitation from './components/precipitation';
import AvgTemp from './components/avgtemp';
import ExtremeTemps from './components/extremetemps';
import StartPage from './components/startPage';
import './App.css';
import logo from './logo.svg';

function App() {
  
  return (
    <Router>
      <div className="App">
        {/* Header Section */}
        <header className="header-container">
          {/* Buttons */}
          <Link to="/weather">
            <button className="my-button">WEATHER</button>
          </Link>
          <Link to="/weather/avg_temp">
            <button className="my-button">AVG TEMP</button>
          </Link>
          <Link to="/weather/hourly">
            <button className="my-button">HOURLY</button>
          </Link>
          <Link to="/weather/precipitation">
            <button className="my-button">PRECIP</button>
          </Link>
          <Link to="weather/extreme_temps">
          <button className="my-button">EXTRTEMP</button>
          </Link>
        </header>

        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/weather/hourly" element={<Hourly />} />
          <Route path="/weather/precipitation" element={<Precipitation />} />
          <Route path="/weather/avg_temp" element={<AvgTemp />} />
          <Route path="/weather/extreme_temps" element={<ExtremeTemps />} />
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;

