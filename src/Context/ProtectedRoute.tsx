import React, { useEffect } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import useTokens from "../hooks/useTokens";
import { toast } from "react-toastify";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useTokens();
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      toast.warning(`You are not Logged In!`);
    }
  }, [token]);

  const isLoginPage = location.pathname === "/login";

  if (!token) {
    // If the user is not logged in and is not on the login page, redirect to login
    if (!isLoginPage) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // If the user is on the login page and not logged in, just render children
    return null;
  }

  // If the user is logged in, render the children
  return <>{children}</>;
};

export const ProtectedRouteWrapper = () => {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
};

export default ProtectedRoute;
