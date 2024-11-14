// src/App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('metric');
  const [loading, setLoading] = useState(false);

  const convertTemperature = (temp, unit) => {
    if (unit === 'imperial') {
      return (temp * 9) / 5 + 32;
    }
    return temp;
  };

  const fetchWeather = async () => {
    setError('');
    setWeatherData(null); // Clear previous data before fetching new data
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: city,
            appid: process.env.REACT_APP_WEATHER_API_KEY,
            units: unit,
          },
        }
      );
      setWeatherData(response.data);
    } catch (err) {
      setError('Could not fetch weather data. Please try a valid city name.');
      setWeatherData(null); // Ensure data is cleared in case of an error
    } finally {
      setLoading(false);
    }
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === 'metric' ? 'imperial' : 'metric'));
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Weather Application</h2>

        <div className="mb-4">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          onClick={fetchWeather}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Get Weather
        </button>

        <button
          onClick={toggleUnit}
          className="w-full bg-gray-500 text-white p-2 rounded mt-4 hover:bg-gray-600"
        >
          Switch to {unit === 'metric' ? 'Fahrenheit' : 'Celsius'}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {loading && (
          <div className="flex justify-center mt-4">
            <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        )}

        {weatherData && !loading && (
          <div className="mt-4">
            <h3 className="text-xl font-bold">{weatherData.name}</h3>
            <p>
              Temperature: {convertTemperature(weatherData.main.temp, unit)}°
              {unit === 'metric' ? 'C' : 'F'}
            </p>
            <p>Weather: {weatherData.weather[0].description}</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind Speed: {weatherData.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
