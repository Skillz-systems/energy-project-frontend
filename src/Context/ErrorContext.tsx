import { createContext, useState, ReactNode } from "react";

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
      {children}
    </ErrorContext.Provider>
  );
};
