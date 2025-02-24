import React from 'react'
import Weather from './components/Weather'
import {Routes, Route } from "react-router-dom";
import Favourites from './components/Favs';


const App = () => {
  return (
    <div className='app'>
    
    <Routes>
      <Route path = "/" element = {<Weather />} />
      <Route path = "/favs" element = {<Favourites /> }></Route>
    </Routes>
    
    
    
    </div>
  )
}

export default App