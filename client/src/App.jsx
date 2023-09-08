import React,{ useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from "./pages/Login";
import Register from "./pages/Register";
import AppHeader from './components/AppHeader';

function App() {
  // const [users, SetUsers] = useState([]);
  return (
    <>
      <BrowserRouter>
        <AppHeader />
        <Routes>

          <Route path='' element={<div><h1> Home </h1></div>} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </BrowserRouter>
	</>
  )
}
export default App
