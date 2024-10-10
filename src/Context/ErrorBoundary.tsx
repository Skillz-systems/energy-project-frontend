import React, { useEffect, useContext, useState } from "react";
import { ErrorContext } from "./ErrorContext";
import ErrorPage from "../Pages/ErrorPage";

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error("ErrorBoundary must be used within an ErrorProvider");
  }

  const { hasError, setHasError } = context;
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (error) {
      setHasError(true);
    }
  }, [error, setHasError]);

  const componentDidCatch = (error: any) => {
    setError(error);
  };

  if (hasError) {
    return <ErrorPage errorInformation={error} />;
  }

  return (
    <ErrorBoundaryWrapper componentDidCatch={componentDidCatch}>
      {children}
    </ErrorBoundaryWrapper>
  );
};

const ErrorBoundaryWrapper = ({
  children,
  componentDidCatch,
}: {
  children: React.ReactNode;
  componentDidCatch: (error: any) => void;
}) => {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      componentDidCatch(event.error || new Error("An unknown error occurred"));
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      componentDidCatch(
        event.reason || new Error("Unhandled promise rejection")
      );
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, [componentDidCatch]);

  return <>{children}</>;
};

export default ErrorBoundary;