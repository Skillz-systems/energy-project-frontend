import { Navigate, Route, Routes } from "react-router-dom";
import {
  LoginPage,
  Settings,
  PageNotFound,
  CreatePassword,
  Dashboard,
  Products,
  Inventory,
  Home,
  Customers,
  Agent,
} from "./Pages/Index";
import "./index.css";
import ProtectedRouteWrapper from "./Context/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./Pages/ErrorPage";

function App() {
  return (
    <>
      <ToastContainer autoClose={2000} />
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorPage error={error} resetErrorBoundary={resetErrorBoundary} />
        )}
      >
        <Routes>
          {/* Protected Routes */}
          <Route element={<ProtectedRouteWrapper />}>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products/*" element={<Products />} />
            <Route path="/inventory/*" element={<Inventory />} />
            <Route path="/agents/*" element={<Agent />} />
            <Route path="/settings/*" element={<Settings />} />
            <Route path="/customers/*" element={<Customers />} />
            {/* Other protected routes */}
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
      </ErrorBoundary>
    </>
  );
}

export default App;
