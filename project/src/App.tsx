import React from "react";
import { Route, Routes } from "react-router-dom";
import "./index.css";
import { Settings, LoginForm } from "./Pages/Index";

function App() {
  
  return (
    <Routes>
      <Route path="/settings/*" element={<Settings />} />
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
}

export default App;
