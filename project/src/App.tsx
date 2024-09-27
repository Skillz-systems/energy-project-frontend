import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./index.css";
import LogoComponent from "./Components/LogoComponent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/logo" element={<LogoComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
