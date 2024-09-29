import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useTokens from "@/hooks/useTokens";
import { toast } from "react-toastify";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [countdown, setCountdown] = useState<number>(3);
  const [redirect, setRedirect] = useState<boolean>(false);

  const { token } = useTokens();
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      toast.warning(
        `You are not Logged In. Redirecting to login page in ${countdown} seconds...`
      );

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            setRedirect(true);
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [token, countdown]);

  if (redirect) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
