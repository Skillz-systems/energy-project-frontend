import { Route, Routes } from "react-router-dom";
import "./index.css";
import LogoComponent from "./Components/LogoComponent/LogoComponent";
import { Settings } from "./Pages/Index";

function App() {
  return (
    <Routes>
      <Route path="/logo" element={<LogoComponent />} />
      <Route path="/settings/*" element={<Settings />} />
    </Routes>
  );
}

export default App;
