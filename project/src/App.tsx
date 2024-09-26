import React from "react";
import UserProfile from "./Components/UserProfile";

import PageBanner from "./Components/PageBanner";
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
