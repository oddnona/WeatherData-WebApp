import React, { useState } from 'react';
import api from '../api/weatherApi';
import GifAnimation from './GifAnimation';

const ExtremeTemps = () => {
  const [formData, setFormData] = useState({
    N: '',
    extreme_type: 'top',
    year: '',
    M: ''
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showErrorImage, setShowErrorImage] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear the other time field when one is filled
    if (name === 'year' && value !== '') {
      setFormData(prev => ({ ...prev, M: '', [name]: value }));
    } else if (name === 'M' && value !== '') {
      setFormData(prev => ({ ...prev, year: '', [name]: value }));
    }
  };

  const getExtremeTemps = async () => {
    try {
      setLoading(true);
      setError('');
      setShowErrorImage(false);

      // Validate N
      if (!formData.N || formData.N < 1) {
        setError('Please enter a valid number for N (must be ≥ 1)');
        setShowErrorImage(true);
        return;
      }

      // Validate that either year or M is provided, but not both
      if (formData.year && formData.M) {
        setError('Please provide either a specific year OR number of previous years (M), not both');
        setShowErrorImage(true);
        return;
      }

      if (!formData.year && !formData.M) {
        setError('Please provide either a specific year OR number of previous years (M)');
        setShowErrorImage(true);
        return;
      }

      if (formData.year && (formData.year < 2020 || formData.year > 2024)) {
        setError('Please enter a valid year (2020 - 2024)');
        setShowErrorImage(true);
        return;
      }

      const params = {
        N: formData.N,
        extreme_type: formData.extreme_type
      };

      // Add either M or year to parameters
      if (formData.year) params.year = formData.year;
      if (formData.M) params.M = formData.M;

      const response = await api.get('/weather/extreme_temps/', {
        params: params
      });

      setResults(response.data['Extreme temperatures: ']);
    } catch (err) {
      console.error('Error fetching extreme temperatures:', err);
      setError(err.response?.data?.error || 'Error fetching extreme temperature data.');
      setShowErrorImage(true);
    } finally {
      setLoading(false);
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Extreme Temperatures</h1>

      <div className="space-y-4">
        <div className="mb-4">
          <label className="block mb-2">Number of Results (N): </label>
          <input
            type="number"
            name="N"
            value={formData.N}
            onChange={handleInputChange}
            className="dropdown"
            min="1"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Type: </label>
          <select
            name="extreme_type"
            value={formData.extreme_type}
            onChange={handleInputChange}
            className="dropdown"
          >
            <option value="top">Highest Temperatures</option>
            <option value="bottom">Lowest Temperatures</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Specific Year: </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            className="dropdown"
            placeholder="(optional)"
            disabled={formData.M !== ''}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Previous Years (M): </label>
          <input
            type="number"
            name="M"
            value={formData.M}
            onChange={handleInputChange}
            className="dropdown"
            min="1"
            placeholder="(optional)"
            disabled={formData.year !== ''}
          />
        </div>

        <button 
          onClick={getExtremeTemps}
          disabled={loading || !formData.N}
          className="small-button" style={{ width: '180px' }}
        >
          {loading ? 'Loading...' : 'Get Extreme Temperatures'}
        </button>
      </div>

      {error && (
        <div className="mt-4">
          <p className="text-red-500 mt-4">{error}</p>
          {showErrorImage && (
            <img 
              src="/puddle.png" 
              alt="Error occurred" 
              style={{ width: '100px', height: 'auto' }}
            />
          )}
        </div>
      )}

      {results && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            {formData.extreme_type === 'top' ? 'Highest' : 'Lowest'} Temperatures
            {formData.year ? ` in ${formData.year}` : 
             formData.M ? ` in the last ${formData.M} years` : ''}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result, index) => (
              <div key={index} className="p-4 border rounded overlay-box">
                <div className="text-lg font-semibold mb-2">#{index + 1}</div>
                <p><strong>City:</strong> {result.city}</p>
                <p><strong>Temperature:</strong> {result.temperature}°C</p>
                <p><strong>Date/Time:</strong> {new Date(result.date_time).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtremeTemps;