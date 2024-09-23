import React from "react";

import "./index.css";
import TopNavComponent from "./Components/TopNavComponent/TopNavComponent";

function App() {
  return (
    <div>
      {/* Render only the Header component */}
      <TopNavComponent 
        logoSrc="logo.png"
        userProfileSrc="user-profile.png"
        userRole="Super Admin"
        date="29th, July 2024"
        notificationsCount={7}
      />
    </div>
  );
}

export default App;
