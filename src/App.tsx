import { Navigate, Route, Routes } from "react-router-dom";
import {
  LoginPage,
  Settings,
  PageNotFound,
  CreatePassword,
  Dashboard,
} from "./Pages/Index";
import "./index.css";
import { ErrorProvider } from "./Context/ErrorContext";
import { ProtectedRouteWrapper } from "./Context/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ErrorProvider>
          <Routes>
            {/* Protected Routes */}
            <Route element={<ProtectedRouteWrapper />}>
              <Route path="/dashboard" element={<Dashboard />} />
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

            {/* Fallback Route */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        <ToastContainer autoClose={1000} />
      </ErrorProvider>
    </>
  );
}

export default App;
