import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LogoComponent from './Components/LogoComponent';
import "./index.css";

function App() {


  return (
    <div className="bg-black p-4 border border-red-600">
      <h1 className='text-white'>Navbar Logo:</h1>
      <LogoComponent variant="nav" />

      <h1>Auth Page Logo:</h1>
      <LogoComponent variant="auth" />
    </div>
  )
}

export default App
