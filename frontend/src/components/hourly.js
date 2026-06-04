import React, { useState } from 'react';
import api from '../api/weatherApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HourlyWeatherView = () => {
  const [city, setCity] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const getHourlyWeather = async (page = 1) => {
    if (!city || !month || !year) {
      setError('Please select all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await api.get('/weather/hourly/', {
        params: {
          city,
          month,
          year,
          page,
          page_size: 24
        }
      });
      
      if (response.data) {
        // Transform hourly_data so that all the numeric values are properly converted into a readable format
        const transformedData = {
          ...response.data,
          hourly_data: response.data.hourly_data.map(item => ({
            ...item,
            hour: Number(item.hour),
            temperature: Number(item.temperature),
            precipitation: Number(item.precipitation),
            rain: Number(item.rain),
            snowfall: Number(item.snowfall),
            formatted_time: new Date(item.date_time).toLocaleTimeString()
          }))
        };
        console.log('Transformed data:', transformedData);
        setWeatherData(transformedData);
        setCurrentPage(response.data.pagination.current_page);
      }
    } catch (err) {
      console.error('Error:', err.response || err);
      setError(
        err.response?.data?.error || 
        'Error fetching hourly weather data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Hourly Weather Data</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-2">City:</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="dropdown"
          >
            <option value="">-- Select a city --</option>
            <option value="Amsterdam">Amsterdam</option>
            <option value="Athens">Athens</option>
            <option value="Atlanta">Atlanta</option>
            <option value="Auckland">Auckland</option>
            <option value="Austin">Austin</option>
            <option value="Bangkok">Bangkok</option>
            <option value="Barcelona">Barcelona</option>
            <option value="Beijing">Beijing</option>
            <option value="Berlin">Berlin</option>
            <option value="Bilbao">Bilbao</option>
            <option value="Birmingham">Birmingham</option>
            <option value="Bogota">Bogota</option>
            <option value="Boston">Boston</option>
            <option value="Brisbane">Brisbane</option>
            <option value="Brussels">Brussels</option>
            <option value="Bucharest">Bucharest</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Month:</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="dropdown"
          >
            <option value="">-- Select a month --</option>
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Year:</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="dropdown"
          >
            <option value="">-- Select a year --</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </div>
      </div>

      <button
        onClick={() => getHourlyWeather(1)}
        disabled={loading || !city || !month || !year}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Get Hourly Data'}
      </button>

      {error && (
        <p className="text-red-500 mt-4">{error}</p>
      )}

      {weatherData && weatherData.hourly_data && weatherData.hourly_data.length > 0 && (
        <div className="mt-6 space-y-6" >
          {/* Summary title at the top of the chart to show city and year detail */}
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3">
              Hourly Data for {city} - {months.find(m => m.value === Number(month))?.label} {year}
            </h2>

            {/* Table of all the different data fieldds */}
            <div className="overflow-x-auto mb-6 overlay-box"
            style={{ display: 'flex', justifyContent: 'center', marginTop: '16px'  }}>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Temperature (°C)</th>
                    <th className="px-4 py-2">Rain (mm)</th>
                    <th className="px-4 py-2">Snow (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  {weatherData.hourly_data.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{item.formatted_time}</td>
                      <td className="px-4 py-2">{item.temperature}</td>
                      <td className="px-4 py-2">{item.rain}</td>
                      <td className="px-4 py-2">{item.snowfall}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Chart to display different temperature variations */}
            <div className="h-80 mt-4">
              <h3 className="text-lg font-semibold mb-2">Temperature Variation</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weatherData.hourly_data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour"
                    label={{ value: 'Hour', position: 'bottom' }}
                  />
                  <YAxis 
                    label={{ value: 'Temperature (°C)', angle: -90, position: 'left' }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#ff7300" 
                    name="Temperature"
                    dot={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Chart to display precipitation data */}
            <div className="h-80 mt-8">
              <h3 className="text-lg font-semibold mb-2">Precipitation</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weatherData.hourly_data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour"
                    label={{ value: 'Hour', position: 'bottom' }}
                  />
                  <YAxis 
                    label={{ value: 'Amount (mm)', angle: -90, position: 'left' }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="rain" 
                    stroke="#82ca9d" 
                    name="Rain"
                    dot={true}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="snowfall" 
                    stroke="#8884d8" 
                    name="Snow"
                    dot={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pagination UI */}
          {weatherData.pagination && weatherData.pagination.total_pages > 1 && (
            <div className="flex justify-center space-x-2 mt-4"
            style={{ display: 'flex', justifyContent: 'center', position: 'relative',
              top: '-14px'  }}>
              <button
                onClick={() => getHourlyWeather(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {weatherData.pagination.total_pages}
              </span>
              <button
                onClick={() => getHourlyWeather(currentPage + 1)}
                disabled={currentPage === weatherData.pagination.total_pages || loading}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HourlyWeatherView;