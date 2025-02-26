import React, {useEffect, useState } from "react";
import "./Weather.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import clear from "../assets/clear.png";
import clouds from "../assets/cloud.png";
import drizzle from "../assets/drizzle.png";
import rain from "../assets/rain.png";
import snow from "../assets/snow.png";
import wind from "../assets/wind.png";

// Mappatura delle condizioni meteo alle immagini
const weatherImages = {
    Clear: clear,
    Clouds: clouds,
    Drizzle: drizzle,
    Rain: rain,
    Snow: snow,
    Wind: wind,
  };


const Preferiti = () => {
  return <Link to="/favs">Favourites <FontAwesomeIcon icon={faStar} style={{ color: "#FFD43B" }} /></Link>;
};

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [currentCity, setCurrentCity] = useState(""); // Città corrente per evitare problemi con i preferiti
  const [favs, setFavs] = useState([]);
  const refreshTime = 10000;

  useEffect(() => {
    const savedWeather = localStorage.getItem("weather");
    const savedCity = localStorage.getItem("city");
    const savedFavorites = localStorage.getItem("favs");

    if (savedWeather) setWeather(JSON.parse(savedWeather));
    if (savedCity) setCurrentCity(savedCity);
    if (savedFavorites) setFavs(JSON.parse(savedFavorites));
  }, []);


  const request = async (city) => {
    if (!city) return;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8d6058da3d223f4bcc07a40e94dcb04f&units=metric`;
    const options = {
      method: 'GET'
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error("Errore nella richiesta!!");
      }

      const data = await response.json();

      if (!data) {
        alert("Città non trovata!");
        setWeather(null);
        return;
      }

      setWeather(data);
      localStorage.setItem("weather", JSON.stringify(data));
      localStorage.setItem("city", city);

    } catch (error) {
      console.error("Errore nella richiesta meteo: ", error);
    }
  };

  useEffect(() => {
    if (!currentCity) return;
    const weather_interval = setInterval(() => request(currentCity), refreshTime);
    return () => clearInterval(weather_interval);
  }, [currentCity]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!city) {
      alert("Inserisci una città!");
    } else {
      setCurrentCity(city);
      request(city);
      setCity(""); // Svuota la barra di input
    }
  };

  const toggleFavorite = () => {
    let updatedFavs;
    if (favs.includes(currentCity)) {
      updatedFavs = favs.filter((fav) => fav !== currentCity);
    } else {
      if (favs.length >= 3) {
        alert("Puoi aggiungere solo 3 città ai preferiti!");
        return;
      }
      updatedFavs = [...favs, currentCity];
    }
    setFavs(updatedFavs);
    localStorage.setItem("favs", JSON.stringify(updatedFavs));
    
    // Salva le informazioni meteo dei preferiti
    const savedWeather = JSON.parse(localStorage.getItem("weatherData")) || {};
    if (weather) {
      savedWeather[currentCity] = weather;
      localStorage.setItem("weatherData", JSON.stringify(savedWeather));
    }


  };

  return (

      <div className="Form">
        <div className="fav-list-button">
        <Preferiti />
        </div>
        
        <form onSubmit={handleSubmit}>
          <h1>Weather</h1>
          <div className="search-bar-container">
            <input
              className="search-bar"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
            />
          </div>
        </form>

        
        {weather && weather.main && weather.weather && weather.wind && (
          <div className="weather-card">
            <h2>{weather.name}</h2>
            <h4>Temperature: {weather.main.temp}°C</h4>
            <div className="weather-details">
              <div className="weather-info">
                <p>Conditions: {weather.weather[0].description}</p>
                <p>Humidity: {weather.main.humidity}%</p>
                <p>Wind Speed: {weather.wind.speed} m/s</p>
                <p>Pressure: {weather.main.pressure} hPa</p>
                <p>Visibility: {weather.visibility} m</p>
              </div>
              <img
                src={weatherImages[weather.weather[0].main]}
                alt={weather.weather[0].description}
                className="weather-icon"
              />
            </div>
            <div className="button-container">
              <button className="fav-button" onClick={toggleFavorite}>
                {favs.includes(currentCity) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
              </button>
              <button className="refresh-button" onClick={() => request(currentCity)}>
                Refresha le informazioni della città
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default Weather;