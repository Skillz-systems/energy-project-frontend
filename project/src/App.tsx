import React from "react";

import UserProfile from "./Components/UserProfile";

import { Route, Routes } from "react-router-dom";

import "./index.css";

function App() {
  return (
    <Routes>
     
      <Route
        path="/"
        element={
          <UserProfile
            profileImage="https://via.placeholder.com/150" 
            userRole="Super Admin"
            parentClassName="custom-parent"
            imageClassname="custom-image"
            titleClassname="custom-title"
          />
        }
      />

      
      
    </Routes>
  );
}

export default App;
