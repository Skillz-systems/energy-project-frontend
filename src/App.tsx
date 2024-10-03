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
import ErrorBoundary from "./Context/ErrorBoundary";
import ProtectedRoute from "./Context/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ErrorProvider>
        <Routes>
          {/* Wrap Routes that require protection */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <Dashboard />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings/*"
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <Settings />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Route that does not require protection */}
          <Route
            path="/login"
            element={
              <ErrorBoundary>
                <LoginPage />
              </ErrorBoundary>
            }
          />

          <Route
            path="/create-password/:id/:token/"
            element={
              <ErrorBoundary>
                <CreatePassword />
              </ErrorBoundary>
            }
          />
          <Route
            path={"/reset-password/:id/:token/"}
            element={
              <ErrorBoundary>
                <CreatePassword />
              </ErrorBoundary>
            }
          />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <ToastContainer autoClose={1000} />
      </ErrorProvider>
    </>
  );
}

export default App;
