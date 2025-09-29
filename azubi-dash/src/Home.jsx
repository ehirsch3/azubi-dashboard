import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // Fetch user information
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/me', { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    // Fetch weather information
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/weather');
        setWeather(response.data);
      } catch (error) {
        console.error("Error fetching weather data", error);
      }
    };

    fetchUserData();
    fetchWeatherData();
  }, []);

  return (
    <div className="home-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="grid-dashboard">
        {/* Welcome Widget */}
        <div className="widget welcome-widget">
          {user ? (
            <>
              <h2>Welcome,</h2>
              <p>{user.firstname} {user.lastname}!</p>
            </>
          ) : (
            <h2>Welcome!</h2>
          )}
        </div>

        {/* Weather Widget */}
        <div className="widget weather-widget">
          {weather ? (
            <>
              <h2>Current Weather</h2>
              <p>{weather.description}</p>
              <p>{weather.temperature}°C</p>
              <p>Humidity: {weather.humidity}%</p>
            </>
          ) : (
            <p>Loading weather...</p>
          )}
        </div>

        {/* Project Insights Widget */}
        <div className="widget insights-widget">
          <h2>Project Insights</h2>
          <ul>
            <li>React, Node.js, Express</li>
            <li>Tailwind CSS & DaisyUI</li>
            <li>Real-time weather updates</li>
            <li>JWT authentication</li>
          </ul>
        </div>

        {/* Additional Info / Quick Stats Widget */}
        <div className="widget info-widget">
          <h2>Quick Stats</h2>
          <p>More info coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
