import React, { useEffect } from 'react'
import "./Weather.css"
import { useState } from 'react'
import {Link} from "react-router-dom"


const Preferiti = () => {
 return <Link to = "/favs">Preferiti</Link>
}


const Weather = () => {

 
  const [weather, setWeather] = useState(null)
  const [city, setCity] = useState("")
  const refreshTime = 5000



  const request = async(city) => {
    
    if(!city) return;


    try{
    const apiKey = process.env.REACT_APP_API_KEY;
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
    
    if(!response.ok){
      throw new Error("Errore nella richiesta!!");
    }
    
    const data = response.json()
    setWeather(data)}catch(error){
      console.error("Errore nella richiesta meteo: ",error);
    }
  }


  useEffect(() => {

    if(!city) return;

    const weather_interval = setInterval(request,refreshTime)

    return () => clearInterval(weather_interval)

  }, [city])

  const handleSubmit = (event) => {
    console.log("sei qua dentro");
    
    if(!city){
      alert("Inserisci una città!")
    
    }else{ 
      
      event.preventDefault();
      request(city);}};

  
  
  return (
    <>
    <div className='Form'>
      
      <form onSubmit={handleSubmit}>
        <h1>Weather App</h1>
        <input 
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
      /> </form>

    </div>
      
      <div className='bottoni'>
          <button  onClick={handleSubmit}>Ottieni informazioni</button>
          <button  onClick={() => {if (!city){alert("Inserisci una città prima di refreshare"); return;}request (city);}}>Refresha le informazioni della città</button>
      </div>
      

    {weather && (
      <div>
        <h2>{weather.name}</h2>
        <h3>{weather.temp}</h3>
      </div>
    )}
    
    <div className='favs'>  

    <Preferiti />

    </div>
  
  
  </>
  )

}

export default Weather