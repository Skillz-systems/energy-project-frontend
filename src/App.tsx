import { Navigate, Route, Routes } from "react-router-dom";
import { LoginForm, Settings, PageNotFound } from "./Pages/Index";
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
                <LoginForm />
              </ErrorBoundary>
            }
          />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <ToastContainer />
      </ErrorProvider>
    </>
  );
}

export default App;
