import React, { useEffect } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import useTokens from "../hooks/useTokens";
import { toast } from "react-toastify";

const ProtectedRouteWrapper: React.FC = () => {
  const { token } = useTokens();
  const location = useLocation();
  const unprotectedRoutes = [
    "/login",
    "/create-password/:id/:token",
    "/reset-password/:id/:token",
  ];

  useEffect(() => {
    if (!token) toast.warning("You are not logged in!");
  }, [token]);

  if (token && !unprotectedRoutes.includes(location.pathname)) {
    /* 
      If the user is logged in and tries to access "/login" route, 
      save the current route to session to be redirected back to in the login page.
    */
    sessionStorage.setItem("redirect", location.pathname);
  }

  if (!token) {
    // If the user is not authenticated, redirect to login with the current path as a redirect query param
    const loginRoute = `/login?redirect=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={loginRoute} replace />;
  } else {
    // If authenticated and not on an unprotected route, render the nested routes
    return <Outlet />;
  }
  return <Outlet />;
};

export default ProtectedRouteWrapper;
