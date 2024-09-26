import React from "react";
import PageBanner from './Components/PageBanner';
import { Route, Routes } from "react-router-dom";
import ProceedButton from "./Components/ProceedButtonComponent";
import LogoComponent from "./Components/LogoComponent/LogoComponent";
import "./index.css";

function App() {
  const handleClick = () => {
    alert("Button clicked!");
  };
  return (
    <Routes>
      <Route path="/logo" element={<LogoComponent />} />
      <Route
        path="/proceedButton"
        element={<ProceedButton onClick={handleClick} />}
      />
      <Route
        path="/pageBanner"
        element={
          <div className="App">
            <PageBanner
              title="Welcome to Our Platform"
              subtitle="Bringing you the best services."
              backgroundImage="/path-to-your-background-image.jpg"
              backgroundColor="#1a202c"
              buttonText="Get Started"
              buttonLink="#"
              overlayOpacity={0.6}
            />
          </div>
        }
      />
    </Routes>
  );
}

export default App;
