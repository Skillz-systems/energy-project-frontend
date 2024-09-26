import Icon from "./Components/IconComponent";  // Ensure this path is correct
import { FaUser } from "react-icons/fa";  // Using react-icons for the icon
import { Route, Routes } from "react-router-dom";  // Routing for different components

import "./index.css";  // Ensure global styles are included

function App() {
  return (
    <Routes>
      {/* Route for the IconComponent */}
      <Route
        path="/"
        element={
          <Icon
            icon={FaUser}  // Using FaUser icon from react-icons
            title="User Icon"  // Title displayed next to the icon
            className="custom-icon-wrapper bg-red-300 w-fit"  // Wrapper class for styling
            iconClassName="custom-icon text-2xl text-[blue]"  // Icon-specific class for styling
            titleClassName="custom-title"  // Title-specific class for styling
            onClick={() => console.log("Icon clicked")}  // Click handler for the icon
          />
        }
      />
    </Routes>
  );
}

export default App;
