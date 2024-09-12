import { Route, Routes } from "react-router-dom";
import LogoComponent from "./Components/LogoComponent/LogoComponent";
import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/logo" element={<LogoComponent />} />
    </Routes>
  );
}

export default App;
