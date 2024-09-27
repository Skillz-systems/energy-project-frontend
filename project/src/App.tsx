import Icon from "./Components/IconComponent";  
import { FaUser } from "react-icons/fa";  
import { Route, Routes } from "react-router-dom";  

import "./index.css";  

function App() {
  return (
    <Routes>
      
      <Route
        path="/"
        element={
          <Icon
            icon={FaUser}  
            title="User Icon"  
            className="custom-icon-wrapper bg-red-300 w-fit"  
            iconClassName="custom-icon text-2xl text-[blue]"  
            titleClassName="custom-title"  
            onClick={() => console.log("Icon clicked")}  
          />
        }
      />
    </Routes>
  );
}

export default App;
