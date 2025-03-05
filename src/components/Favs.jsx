import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Favs.css";

import clear from "../assets/clear.png";
import clouds from "../assets/cloud.png";
import drizzle from "../assets/drizzle.png";
import rain from "../assets/rain.png";
import snow from "../assets/snow.png";
import wind from "../assets/wind.png";


const weatherImages = {
  Clear: clear,
  Clouds: clouds,
  Drizzle: drizzle,
  Rain: rain,
  Snow: snow,
  Wind: wind,
};




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

  useEffect(() => {
    console.log({weatherData});
  },[weatherData]);


  return (
    <div>
      {favs.length > 0 ? (
        <>
          <h1>Città preferite:</h1>
          <ul className="favorite-list">
            {favs.slice(0, 3).map((city, index) => (
              <li key={index} className="favorite-item">
                {weatherData[city] && weatherData[city].main && weatherData[city].weather && weatherData[city].weather[0] && weatherData[city].wind && (
                  <div className="favorite-card">
                    <h2>{weatherData[city].name}</h2>
                    <h3>Temperature: {weatherData[city].main.temp}°C</h3>
                    <p>Conditions: {weatherData[city].weather[0].description}</p>
                    <p>Humidity: {weatherData[city].main.humidity}%</p>
                    <p>Wind Speed: {weatherData[city].wind.speed} m/s</p>
                    <p>Pressure: {weatherData[city].main.pressure} hPa</p>
                    <p>Visibility: {weatherData[city].visibility} m</p>

                    <img
                    src={weatherImages[weatherData[city].weather[0].main]}
                    alt={weatherData[city].weather[0].description}
                    className="weather-fav-icon"
                  />

                    <button className="remove-fav" onClick={() => removeFavorite(city)}>
                      Rimuovi dai preferiti
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <Link to="/" className="home-link">Home</Link>
          <button className="remove-favs" onClick={clearFavorites}>Rimuovi tutti</button>
        </>
      ) : (
        <>
          <h1>Nessuna Città tra i preferiti!!</h1>
          <p>Non hai ancora aggiunto alcuna città, torna alla home e aggiungine!</p>
          <Link to="/" className="no-favs">Home</Link>
        </>
      )}
    </div>
  );
};

export default Favourites;