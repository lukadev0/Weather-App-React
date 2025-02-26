import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Favs.css";

const Favourites = () => {
  const [favs, setFavs] = useState([]);
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favs")) || [];
    const savedWeatherData = JSON.parse(localStorage.getItem("weatherData")) || {};
    setFavs(savedFavorites);
    setWeatherData(savedWeatherData);
  }, []);

  const removeFavorite = (city) => {
    const updatedFavs = favs.filter((fav) => fav !== city);
    const updatedWeatherData = { ...weatherData };
    delete updatedWeatherData[city];

    setFavs(updatedFavs);
    setWeatherData(updatedWeatherData);
    localStorage.setItem("favs", JSON.stringify(updatedFavs));
    localStorage.setItem("weatherData", JSON.stringify(updatedWeatherData));
  };

  const clearFavorites = () => {
    setFavs([]);
    setWeatherData({});
    localStorage.removeItem("favs");
    localStorage.removeItem("weatherData");
  };

  return (
    <div>
      <h1>Città preferite:</h1>
      {favs.length > 0 ? (
        <>
          <ul className="favorite-list">
            {favs.map((city, index) => (
              <li key={index} className="favorite-item">
                {weatherData[city] && weatherData[city].main && weatherData[city].weather && weatherData[city].wind && (
                  <div className="favorite-card">
                    
                    <h2>{weatherData[city].name}</h2>
                    <h3>Temperature: {weatherData[city].main.temp}°C</h3>
                    <p>Conditions: {weatherData[city].weather[0].description}</p>
                    <p>Humidity: {weatherData[city].main.humidity}%</p>
                    <p>Wind Speed: {weatherData[city].wind.speed} m/s</p>
                    <p>Pressure: {weatherData[city].main.pressure} hPa</p>
                    <p>Visibility: {weatherData[city].visibility} m</p>
                    
                    <button className="remove-fav" onClick={() => removeFavorite(city)}>
                      Rimuovi dai preferiti
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <button className="remove-favs" onClick={clearFavorites}>Rimuovi tutti</button>
        </>
      ) : (
        <p>Non hai ancora preferiti.</p>
      )}
      <Link to="/">Home</Link>
    </div>
  );
};

export default Favourites;
