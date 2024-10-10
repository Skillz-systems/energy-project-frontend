import { createContext, useState, ReactNode } from "react";
import ErrorBoundary from "./ErrorBoundary";

interface ErrorContextType {
  hasError: boolean;
  setHasError: (value: boolean) => void;
}

export const ErrorContext = createContext<ErrorContextType | undefined>(
  undefined
);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <ErrorContext.Provider value={{ hasError, setHasError }}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </ErrorContext.Provider>
  );
};
