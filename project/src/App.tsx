import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./index.css";
import Dashboard from "./Pages/DashBoardPage/DashBoardPage";

function App() {
  return (
    <Routes>
      <Route path="/DashBoard" element={<Dashboard />} />
      {/* Add a fallback route for any unmatched routes */}
      <Route path="*" element={<Navigate to="/DashBoard" replace />} />
    </Routes>
  );
}

export default App;
