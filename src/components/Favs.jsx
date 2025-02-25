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
          <ul>
            {favs.map((city, index) => (
              <li key={index}>
                {weatherData[city] && (
                  <div className="weather-card-fav">
                    <h2>{city}</h2>
                    <h3>Temperatura: {weatherData[city].temperature}</h3>
                    <p>Condizioni: {weatherData[city].condition}</p>
                    <p>Umidità: {weatherData[city].humidity}</p>
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
