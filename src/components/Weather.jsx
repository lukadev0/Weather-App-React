import React, { useCallback, useEffect, useState } from "react";
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
  const[count,setCount] = useState(0);
  const refreshTime = 3000;

  useEffect(() => {
    const savedWeather = localStorage.getItem("weather");
    const savedCity = localStorage.getItem("city");
    const savedFavorites = localStorage.getItem("favs");

    if (savedWeather) setWeather(JSON.parse(savedWeather));
    if (savedCity) setCurrentCity(savedCity);
    if (savedFavorites) setFavs(JSON.parse(savedFavorites));
  }, []);

  

  function callbackFunctionforinteval(){
    request(currentCity);
    setCount((count) => count + 1);

  }

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
    const weather_interval = setInterval(callbackFunctionforinteval, refreshTime);
    return () => clearInterval(weather_interval);
  },[currentCity]);

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

    <div>
      <h1>Contatore: {count}</h1>
    </div>

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

      {weather && weather.main && weather.weather && weather.wind && (
        <div className="weather-card">
          <h2>{weather.name}</h2>
          <h4>Temperature: {weather.main.temp}°C</h4>
          <p>Conditions: {weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
          <p>Pressure: {weather.main.pressure} hPa</p>
          <p>Visibility: {weather.visibility} m</p>
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