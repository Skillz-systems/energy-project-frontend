import React, { useState, useEffect } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import useTokens from "../hooks/useTokens";
import { toast } from "react-toastify";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [redirect, setRedirect] = useState<boolean>(false);

  const { token } = useTokens();
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      setRedirect(true);
      toast.warning(`You are not Logged In!`);
    }
  }, [token]);

  if (redirect) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!token) {
    return <div></div>;
  } else {
    return <>{children}</>;
  }
};

export default ProtectedRoute;


export const ProtectedRouteWrapper = () => {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
};