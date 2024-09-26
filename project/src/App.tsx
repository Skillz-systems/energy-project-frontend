import Icon from "./Components/IconComponent";
import { FaHome } from "react-icons/fa";
import { Route, Routes } from "react-router-dom";
import LogoComponent from "./Components/LogoComponent/LogoComponent";
import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/logo" element={<LogoComponent />} />
      <Route
        path="/iconComponent"
        element={
          <Icon
            icon={FaHome}
            title="Home"
            size="medium"
            color="blue"
            position="right"
            onClick={() => alert("Home icon clicked!")}
            className="bg-gray-100 p-4 rounded-lg"
            titleClassName="text-blue-500"
            iconClassName="text-blue-700"
          />
        }
      />
    </Routes>
  );
}

export default App;
