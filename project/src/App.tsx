import React from "react";
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
    </Routes>
  );
}

export default App;
