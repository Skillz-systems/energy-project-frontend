import React from "react";
import { FaPlus } from "react-icons/fa";
import ActionButton from "./Components/ActionButtonComponent/ActionButton";
import UserProfile from "./Components/UserProfile";
import PageBanner from "./Components/PageBanner";
import { Route, Routes } from "react-router-dom";
import "./index.css";

function App() {
  const handleClick = () => alert("Button clicked!");

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
        path="/actionButton"
        element={
          <ActionButton
            label="New Email"
            icon={<FaPlus />}
            onClick={handleClick}
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
