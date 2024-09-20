import { Route, Routes } from "react-router-dom";
import LogoComponent from "./Components/LogoComponent/LogoComponent";
import LoginForm from './Pages/LoginPage';
import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/logo" element={<LogoComponent />} />
      <Route path="/logo" element={<LoginForm />} />
    </Routes>
  )}

export default App;
