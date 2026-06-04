import React, { useState } from 'react';
import api from '../api/weatherApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AvgTemp = () => {
  const [city, setCity] = useState('');
  const [year, setYear] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const monthNames = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
  };

  const getAverageTemp = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get('/weather/avg_temp/', {
        params: {
          city,
          year
        }
      });
      
      // Transform data to include month names for better visualization
      const transformedData = response.data.monthly_averages.map(item => ({
        ...item,
        monthName: monthNames[item.month],
        average_temperature: Number(item.average_temperature)
      }));
      
      setWeatherData({
        ...response.data,
        monthly_averages: transformedData
      });
    } catch (err) {
      console.error('Error:', err.response || err);
      setError(err.response?.data?.error || 'Error fetching average temperature data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Average Monthly Temperature</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
        onClick={getAverageTemp}
        style={{ width: '180px' }}
        disabled={loading || !city || !year}
        className="small-button"
      >
        {loading ? 'Loading...' : 'Get Average Temperatures'}
      </button>

      {error && (
        <p className="text-red-500 mt-4">{error}</p>
      )}

      {weatherData && (
        <div className="mt-6 space-y-6">
          {/* Summary title at the top of the chart to show city and year detail */}
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3">
              Temperature Summary for {city} ({year})
            </h2>
            
            {/* Data table */}
            <div className="flex justify-center mt-4 overlay-box">
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <table className="bg-white border-collapse border border-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 bg-gray-100 border border-gray-200">Month</th>
                      <th className="px-4 py-2 bg-gray-100 border border-gray-200">Average Temperature (°C)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weatherData.monthly_averages.map((month) => (
                      <tr key={month.month} className="border-t">
                        <td className="px-4 py-2 border border-gray-200 text-center">{month.monthName}</td>
                        <td className="px-4 py-2 border border-gray-200 text-center">
                          {month.average_temperature}°C
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Chart to display temperature data */}
          <div className="h-96">
            <h3 className="text-lg font-semibold mb-2">Monthly Temperature Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weatherData.monthly_averages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="monthName" 
                  label={{ value: 'Month', position: 'bottom' }}
                />
                <YAxis 
                  label={{ value: 'Temperature (°C)', angle: -90, position: 'left' }}
                />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="average_temperature" 
                  stroke="#ff7300" 
                  name="Average Temperature"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvgTemp;