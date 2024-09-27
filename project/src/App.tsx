import React from "react";
import { Route, Routes } from "react-router-dom";
import "./index.css";
import { Settings } from "./Pages/Index";

function App() {
  
  return (
    <Routes>
      <Route path="/settings/*" element={<Settings />} />
    </Routes>
  );
}

export default App;
