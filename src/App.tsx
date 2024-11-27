import { Navigate, Route, Routes } from "react-router-dom";
import {
  LoginPage,
  Settings,
  PageNotFound,
  CreatePassword,
  Dashboard,
  Products,
  Inventory,
  Agent,
} from "./Pages/Index";
import "./index.css";
import { ErrorProvider } from "./Context/ErrorContext";
import ProtectedRouteWrapper from "./Context/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgressBar from "./Components/Progressbar/ProgressBar";

function App() {
  return (
    <>
      <ErrorProvider>
        <Routes>
          {/* Protected Routes */}
          <Route element={<ProtectedRouteWrapper />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products/*" element={<Products />} />
            <Route path="/inventory/*" element={<Inventory />} />
            <Route path="/agents/*" element={<Agent />} />
            <Route path="/settings/*" element={<Settings />} />
          </Route>

          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/create-password/:id/:token"
            element={<CreatePassword />}
          />
          <Route
            path="/reset-password/:id/:token"
            element={<CreatePassword />}
          />
          <Route
            path="/test-progress-bar"
            element={
              <div className="p-8">
                <ProgressBar
                  percentage={85}
                  parentClassname="custom-parent-class"
                  percentageClassname="custom-percentage-class"
                />
                <ProgressBar percentage={60} />
                <ProgressBar percentage={90} />
              </div>
            }
          />
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/create-password/:id/:token"
            element={<CreatePassword />}
          />
          <Route
            path="/reset-password/:id/:token"
            element={<CreatePassword />}
          />

          {/* Fallback Route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <ToastContainer autoClose={2000} />
      </ErrorProvider>
    </>
  );
}

export default App;
