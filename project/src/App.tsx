import { Route, Routes } from "react-router-dom";
import LogoComponent from "./Components/LogoComponent/LogoComponent";
import LoginForm from "./Pages/LoginPage";
import "./index.css";

function App() {
  return (
    <Routes>
      {/* Show LoginForm on the root path "/" */}
      <Route path="/" element={<LoginForm />} />

      {/* Route for "/logo" */}
      <Route path="/logo" element={<LogoComponent />} />

      {/* Optional: Catch-all route for unmatched paths */}
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
