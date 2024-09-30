
import { Route, Routes, Navigate } from "react-router-dom";
import "./index.css";
import Action from "./Components/ActionButtonComponent/Action";



function App() {
  return (
    <Routes>
      <Route path="/ActionButton" element={<Action/>} />
      <Route path="*" element={<Navigate to="/Action" replace />} />
    </Routes>
  );
}

export default App;
