import React from "react";
import { Route, Routes } from "react-router-dom";
import PageBanner from "./Components/PageBanner";
import ProceedButton from "./Components/ProceedButtonComponent";
import LogoComponent from "./Components/LogoComponent/LogoComponent";
import HeaderBadge from "./Components/HeaderBadgeComponent/HeaderBadgeComponent";
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
        path="/headerBadge"
        element={
          <div>
            <HeaderBadge
              pageName="Inventory"
              imageSrc="/Images/Inventory.png"
            />
          </div>
        }
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
