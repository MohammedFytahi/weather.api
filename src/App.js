import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [shortTermForecast, setShortTermForecast] = useState([]);

  const apiKey = '895284fb2d2c50a520ea537456963d9c';

  useEffect(() => {
    if (location) {
      fetchWeatherData(location);
    } else {
      setData({});
      setShortTermForecast([]);
    }
  }, [location]);

  const fetchWeatherData = (location) => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=imperial&appid=${apiKey}`;

    axios.all([
      axios.get(weatherUrl),
      axios.get(forecastUrl)
    ])
    .then(axios.spread((weatherResponse, forecastResponse) => {
      setData(weatherResponse.data);
      const currentDate = new Date();
      const nextThreeHours = new Date(currentDate.getTime() + 3 * 60 * 60 * 1000); 
      const shortTermForecastData = forecastResponse.data.list.filter(item => new Date(item.dt_txt) <= nextThreeHours);
      setShortTermForecast(shortTermForecastData);
    }))
    .catch(error => console.error('Error fetching data:', error));
  };

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      fetchWeatherData(location);
      setLocation('');
    }
  };

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder='Enter Location'
          type="text"
        />
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main && <h1>{data.main.temp.toFixed()}°F</h1>}
          </div>
          <div className="description">
            {data.weather && <p>{data.weather[0].main}</p>}
          </div>
        </div>
        <div className="forecast">
          <h2>Short Term Forecast</h2>
          {shortTermForecast.map((item, index) => (
            <div key={index} className="forecast-item">
              <p>{item.dt_txt}</p>
              <p>{item.main.temp.toFixed()}°F</p>
              {item.weather && <img src={`http://openweathermap.org/img/w/${item.weather[0].icon}.png`} alt="weather icon" />}
            </div>
          ))}
           {data.name && (
          <div className="bottom">
            <div className="feels">
              <p className='bold'>{data.main.feels_like.toFixed()}°F</p>
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              <p className='bold'>{data.main.humidity}%</p>
              <p>Humidity</p>
            </div>
            <div className="wind">
              <p className='bold'>{data.wind.speed.toFixed()} MPH</p>
              <p>Wind Speed</p>
            </div>
          </div>
        )}
        </div>
       
      </div>
    </div>
  );
}

export default App;
