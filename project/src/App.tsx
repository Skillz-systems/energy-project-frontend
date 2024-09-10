import { Route, Routes } from "react-router-dom";
import LogoComponent from "./Components/LogoComponent/LogoComponent";

function App() {
  return (
    <Routes>
      <Route path="/logo" element={<LogoComponent />} />
    </Routes>
  );
}

export default App;
