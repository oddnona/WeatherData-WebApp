import React, { useState, useEffect } from 'react';
import api from '../api/weatherApi';
import GifAnimation from './GifAnimation';

const Weather = () => {
  const [city, setCity] = useState('');
  const [exactTime, setExactTime] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [displayFormat, setDisplayFormat] = useState('json');
  const [showErrorImage, setShowErrorImage] = useState(false);
  const [activeTab, setActiveTab] = useState('get');
  const [formData, setFormData] = useState({
    temperature: '',
    precipitation: '',
    rain: '',
    snowfall: ''
  });

  // Updating the way we handle inputs, we now take in form data and handle it in this function
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  //GET
  const getWeather = async () => {
    try {
      setError('');
      setShowErrorImage(false);

      // await response from api using query parameters
      const response = await api.get('/weather/', {
        params: {
          city: city,
          hour: exactTime,
        },
      });
  
      console.log('Response received:', response.data);
  
      // if data found, set the weather data, else error
      if (response.data) {
        setWeatherData(response.data);
      } else {
        setError('No weather data found for the specified inputs.');
      }
    } catch (err) {
      console.error('Error details:', err.response || err);
      setError(
        err.response?.data?.error ||
        'Error fetching weather data. Please try again.'
      );
      setShowErrorImage(true);
    } 
  };

  // POST (Create)
  const createWeather = async () => {
    try {
      setError(''); 
      setShowErrorImage(false);
      // create a payload object with the form data
      const payload = {
        city,
        date_time: exactTime,
        ...formData
      };

      // log the post request and await response from the api
      console.log('POST request with:', payload);
      const response = await api.post('/weather/', payload);
      console.log('POST response:', response.data);

      setWeatherData(response.data);
    } catch (err) {
      console.error('POST Error details:', err.response || err);
      setError(
        err.response?.data?.error ||
        'Error creating weather data. Please try again.'
      );
      setShowErrorImage(true);
    }
  };

  // PUT (Update)
  const updateWeather = async () => {
    try {
      setError(''); 
      setShowErrorImage(false);
      const payload = {
        city,
        date_time: exactTime,
        ...formData
      };

      // log the put request and await response from the api
      console.log('PUT request with:', payload);
      const response = await api.put('/weather/update_by_city/', formData, {
        params: {
            city: city,
            time: exactTime
        }
      });
      console.log('PUT response:', response.data);

      setWeatherData(response.data);
    } catch (err) {
      console.error('PUT Error details:', err.response || err);
      setError(
        err.response?.data?.error ||
        'Error updating weather data. Please make sure all fields are filled, and try again.'
      ); 
      setShowErrorImage(true);
    }
  };

  // DELETE
  const deleteWeather = async () => {
    try {
      setError(''); 
      setShowErrorImage(false);

    // log the delete request and await response from the api
      console.log('DELETE request with:', { city, hour: exactTime });
      await api.delete('/weather/destroy_by_city/', {
        params: {
          city: city,
          time: exactTime,
        },
      });
      
      setWeatherData(null);
      console.log('DELETE response: Weather entry deleted successfully.');
    } catch (err) {
      console.error('DELETE Error details:', err.response || err);
      setError(
        err.response?.data?.error ||
        'Error deleting weather data. Please try again.'
      );
      setShowErrorImage(true);
    }
  };


  // This function converts a given JSON file into a CSV file 
  const convertToCSV = (data) => {
    if (!data) return '';
    
    // Creates and merges the headers row file
    const headers = ['city', 'date_time', 'temperature', 'precipitation', 'rain', 'snowfall'];
    let csv = headers.join(',') + '\n';
    
    // Creates the data rows
    const row = headers.map(header => {
        let value = data[header];
        if (header === 'date_time') {
            value = new Date(value).toLocaleString();
        }
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    }).join(',');
    
    csv += row;
    return csv;
  };
  
  // Moved the input form code of the UI out into this const, and added special cases 
  // for when the active tab is post and put, as they require more input fields
  const renderForm = () => (
    <div className="space-y-4">
      {(activeTab === 'get' || activeTab === 'post' || activeTab === 'put' || activeTab === 'delete') && (
        <>
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
            <label className="block mb-2">Exact Time:</label>
            <input
              type="datetime-local"
              value={exactTime}
              onChange={(e) => setExactTime(e.target.value)}
              className="dropdown"
            />
          </div>
        </>
      )}

      {(activeTab === 'post' || activeTab === 'put') && (
        <>
          <div>
            <label className="block mb-2">Temperature (°C):</label>
            <input
              type="number"
              name="temperature"
              value={formData.temperature}
              onChange={handleFormChange}
              className="dropdown"
              step="0.1"
            />
          </div>
          
          <div>
            <label className="block mb-2">Precipitation:</label>
            <input
              type="number"
              name="precipitation"
              value={formData.precipitation}
              onChange={handleFormChange}
              className="dropdown"
              step="0.1"
            />
          </div>
          
          <div>
            <label className="block mb-2">Rain:</label>
            <input
              type="number"
              name="rain"
              value={formData.rain}
              onChange={handleFormChange}
              className="dropdown"
              step="0.1"
            />
          </div>
          
          <div>
            <label className="block mb-2">Snowfall:</label>
            <input
              type="number"
              name="snowfall"
              value={formData.snowfall}
              onChange={handleFormChange}
              className="dropdown"
              step="0.1"
            />
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Weather Information</h1>
      
      {/* Creating different tabs for the different processes */}
      <div className="flex space-x-2 mb-6">
        {['get', 'post', 'put', 'delete'].map((op) => (
          <button
            key={op}
            onClick={() => {
              setActiveTab(op);
              setError('');
              setWeatherData(null);
            }}
            className="small-button"
          >
            {op.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Input form is rendered here*/}
      {renderForm()}

      <div className="mt-4">
        <button 
          onClick={() => {
            switch (activeTab) {
              case 'get':
                getWeather();
                break;
              case 'post':
                createWeather();
                break;
              case 'put':
                updateWeather();
                break;
              case 'delete':
                deleteWeather();
                break;
              default:
                console.error('Unknown operation');
            }
          }}
          className="small-button" style={{ width: '120px' }}
        >
          {activeTab === 'get' ? 'Get Weather' : 
           activeTab === 'post' ? 'Create Weather' :
           activeTab === 'put' ? 'Update Weather' : 'Delete Weather'}
        </button>
      </div>

      {error && (
        <div className="mt-4">
          <p className="text-red-500">{error}</p>
          {showErrorImage && (
            <img 
              src="/puddle.png" 
              alt="Error occurred" 
              style={{ width: '100px', height: 'auto' }}
            />
          )}
        </div>
      )}

      {weatherData && activeTab !== 'delete' && (
        <>
          <div className="mt-16 p-4 border rounded overlay-box">
            <h3 className="text-xl font-semibold mb-2">Weather Data:</h3>
            <p><strong>City:</strong> {weatherData.city}</p>
            <p><strong>Temperature:</strong> {weatherData.temperature}°C</p>
            <p><strong>Precipitation:</strong> {weatherData.precipitation}</p>
            <p><strong>Rain:</strong> {weatherData.rain}</p>
            <p><strong>Snowfall:</strong> {weatherData.snowfall}</p>
            <p><strong>Date/Time:</strong> {new Date(weatherData.date_time).toLocaleString()}</p>
          </div>

          {/* The two buttons that switch between json and csv */}
          <div className="mt-4">
            <div className="mb-4">
              <button 
                onClick={() => setDisplayFormat('json')}
                className="small-button"
              >
                JSON
              </button>
              
              <button 
                onClick={() => setDisplayFormat('csv')}
                className="small-button"
              >
                CSV
              </button>
            </div>

            <div className="mt-16 p-4 border rounded overlay-box">
              <h3 className="text-xl font-semibold mb-2">
                Weather Data ({displayFormat.toUpperCase()}):
              </h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto whitespace-pre-wrap">
                {displayFormat === 'json' 
                  ? JSON.stringify(weatherData, null, 2)
                  : convertToCSV(weatherData)
                }
              </pre>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;