import React, { useEffect, useState } from "react";
import "./Weather.css";
import { Link } from "react-router-dom";

const Preferiti = () => {
  return <Link to="/favs">Preferiti</Link>;
};

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [currentCity, setCurrentCity] = useState(""); // Città corrente per evitare problemi con i preferiti
  const [favs, setFavs] = useState([]);
  const refreshTime = 5000;

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

    try {
      const response = await fetch("/weather.json");

      if (!response.ok) {
        throw new Error("Errore nella richiesta!!");
      }

      const data = await response.json();
      const cityWeather = data.find(
        (item) => item.city.toLowerCase() === city.toLowerCase()
      );

      if (!cityWeather) {
        alert("Città non trovata!");
        setWeather(null);
        return;
      }

      setWeather(cityWeather);
      localStorage.setItem("weather", JSON.stringify(cityWeather));
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
    <>
      <div className="Form">
        <form onSubmit={handleSubmit}>
          <h1>Weather App</h1>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
          />
        </form>
      </div>

      <div className="bottoni">
        <button onClick={handleSubmit}>Ottieni informazioni</button>
        <button
          onClick={() => {
            if (!currentCity) {
              alert("Inserisci una città prima di refreshare");
              return;
            }
            request(currentCity);
          }}
        >
          Refresha le informazioni della città
        </button>
      </div>

      {weather && (
        <div className="weather-card">
          <h2>{weather.city}</h2>
          <h3>Temperatura: {weather.temperature}</h3>
          <p>Condizioni: {weather.condition}</p>
          <p>Umidità: {weather.humidity}</p>
          <button className="fav-button" onClick={toggleFavorite}>
            {favs.includes(currentCity) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
          </button>
        </div>
      )}

      <div className="favs">
        <Preferiti />
      </div>
    </>
  );
};

export default Weather;
