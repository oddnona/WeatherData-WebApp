import React, { useState } from 'react';
import api from '../api/weatherApi';
import GifAnimation from './GifAnimation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Precipitation = () => {
  const [city, setCity] = useState('');
  const [month, setMonth] = useState('');
  const [batchSize, setBatchSize] = useState('20');
  const [precipData, setPrecipData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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

  const batchSizes = [10, 20, 50, 100];

  const getPrecipitation = async () => {
    if (!city || !month) {
      setError('Please select both city and month');
      
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await api.get('/weather/precipitation/', {
        params: {
          city,
          month,
          batch_size: batchSize
        }
      });

      if (response.data) {
        setPrecipData(response.data);
      }
    } catch (err) {
      console.error('Error:', err.response || err);
      setError(
        err.response?.data?.error ||
        'Error fetching precipitation data. Please try again.'
      );
    } finally {
      setLoading(false);
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }
  };

  // Helper function to prepare data for chart
  const prepareChartData = () => {
    if (!precipData) return [];
    return precipData.batches.reduce((acc, batch) => {
      return [...acc, ...batch.data];
    }, []);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Daily Precipitation Data</h1>
      {isAnimating && <GifAnimation isAnimating={isAnimating} />}
      
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
          <label className="block mb-2">Batch Size:</label>
          <select
            value={batchSize}
            onChange={(e) => setBatchSize(e.target.value)}
            className="dropdown"
          >
            {batchSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={getPrecipitation}
        disabled={loading || !city || !month}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        style={{ width: '150px' }}
      >
        {loading ? 'Loading...' : 'Get Precipitation Data'}
      </button>

      {error && (
        <p className="text-red-500 mt-4">{error}</p>
      )}

      {precipData && (
        <div className="mt-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3">
              Precipitation Data for {city} - {months.find(m => m.value === Number(month))?.label}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overlay-box">
              <div>
                <p className="text-gray-600">Total Records</p>
                <p className="text-lg font-medium">{precipData.total_records}</p>
              </div>
              <div>
                <p className="text-gray-600">Batch Size</p>
                <p className="text-lg font-medium">{precipData.batch_size}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Batches</p>
                <p className="text-lg font-medium">{precipData.total_batches}</p>
              </div>
            </div>
          </div>

          <div className="h-96">
            <h3 className="text-lg font-semibold mb-2">Daily Precipitation Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prepareChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day"
                  label={{ value: 'Day of Month', position: 'bottom' }}
                />
                <YAxis 
                  label={{ value: 'Precipitation (mm)', angle: -90, position: 'left' }}
                />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="precipitation" 
                  stroke="#8884d8" 
                  name="Precipitation"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto overlay-box">
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <table className="min-w-full bg-white border rounded">
                <thead>
                  <tr>
                    <th className="px-4 py-2 bg-gray-50">Batch</th>
                    <th className="px-4 py-2 bg-gray-50">Day</th>
                    <th className="px-4 py-2 bg-gray-50">Precipitation (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  {precipData.batches.map((batch, batchIndex) => (
                    batch.data.map((item, itemIndex) => (
                      <tr key={`${batchIndex}-${itemIndex}`} className="border-t">
                        <td className="px-4 py-2 text-center">{batch.batch_number}</td>
                        <td className="px-4 py-2 text-center">{item.day}</td>
                        <td className="px-4 py-2 text-center">{item.precipitation}</td>
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Precipitation;