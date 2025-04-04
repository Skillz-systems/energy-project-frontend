import useTokens from "../hooks/useTokens";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import useSWR from "swr";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Location, useLocation } from "react-router-dom";
import { useState } from "react";

// Create an axios instance
const baseURL = import.meta.env.VITE_API_URL;
const apiClient = axios.create({
  baseURL: baseURL as string,
});

// API call for POST, PUT, DELETE, PATCH requests
interface ApiCallOptions {
  endpoint: string;
  method: "post" | "put" | "delete" | "patch" | "get";
  params?: any;
  data?: any;
  headers?: any;
  successMessage?: string;
  showToast?: boolean;
}

export const useApiCall = () => {
  const { token } = useTokens();
  const location = useLocation();
  const [isNetworkError, setIsNetworkError] = useState(false);
  const { errorStates, updateErrorState, setToastShown } = useEndpointErrors();

  const apiCall = async ({
    endpoint,
    method,
    params = {},
    data = {},
    headers = {},
    successMessage = "Successful",
    showToast = true,
  }: ApiCallOptions): Promise<any> => {
    const url = import.meta.env.VITE_API_URL;
    const baseURL = `${url}/api`;

    const requestConfig: AxiosRequestConfig = {
      baseURL,
      url: endpoint,
      method,
      params,
      data,
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await apiClient(requestConfig);
      if (response.status >= 200 && response.status < 300 && showToast) {
        toast.success(successMessage);
      }
      updateErrorState(endpoint, false, true); // Reset error state on success
      return response;
    } catch (error: any) {
      handleApiError(
        error,
        location,
        setIsNetworkError,
        endpoint,
        errorStates,
        updateErrorState,
        setToastShown
      );
      throw error;
    }
  };

  return {
    apiCall,
    isNetworkError,
  };
};

// SWR hook for GET requests with revalidation
export const useGetRequest = (
  endpoint: string,
  revalidate = true,
  refreshInterval?: number
) => {
  const { token } = useTokens();
  const location = useLocation();
  const { errorStates, updateErrorState, setToastShown } = useEndpointErrors();
  const [isNetworkError, setIsNetworkError] = useState<boolean>(false);

  // Check error state before making the call
  const endpointState = errorStates.find(
    (entry) => entry.endpoint === endpoint
  );

  const fetcher = async (url: string): Promise<any> => {
    if (endpointState?.errorExists && endpointState.errorCount >= 5) {
      console.warn(`Blocked fetch for ${endpoint} due to repeated errors.`);
      throw new Error(`Blocked fetch for ${endpoint}`);
    }

    // SWR fetcher function with axios
    try {
      const response = await apiClient.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      updateErrorState(endpoint, false, true); // Reset error state on success
      setIsNetworkError(false);
      return response.data;
    } catch (error: any) {
      handleApiError(
        error,
        location,
        setIsNetworkError,
        endpoint,
        errorStates,
        updateErrorState,
        setToastShown
      );
      throw error;
    }
  };

  const swrResponse = useSWR(
    `${apiClient.defaults.baseURL}/api${endpoint}`,
    fetcher,
    {
      revalidateOnFocus: revalidate,
      revalidateOnReconnect: revalidate,
      refreshInterval,
    }
  );

  return {
    ...swrResponse,
    errorStates: { errorStates, isNetworkError },
  };
};

export type ApiErrorStatesType = {
  errorStates: {
    endpoint: string;
    errorExists: boolean;
    errorCount: number;
    toastShown: boolean;
  }[];
  isNetworkError: boolean;
};

// Hook to manage error states for endpoints
const useEndpointErrors = () => {
  const [errorStates, setErrorStates] = useState<
    Array<{
      endpoint: string;
      errorExists: boolean;
      errorCount: number;
      toastShown: boolean;
    }>
  >([]);

  const updateErrorState = (
    endpoint: string,
    error: boolean,
    resetToast = false
  ) => {
    setErrorStates((prev) => {
      const existing = prev.find((entry) => entry.endpoint === endpoint);

      if (existing) {
        return prev.map((entry) =>
          entry.endpoint === endpoint
            ? {
                ...entry,
                errorExists: error,
                errorCount: error ? entry.errorCount + 1 : 0,
                toastShown: resetToast ? false : entry.toastShown,
              }
            : entry
        );
      } else if (error) {
        return [
          ...prev,
          { endpoint, errorExists: true, errorCount: 1, toastShown: false },
        ];
      }
      return prev; // No change if resetting non-existent entry
    });
  };

  const setToastShown = (endpoint: string) => {
    setErrorStates((prev) =>
      prev.map((entry) =>
        entry.endpoint === endpoint ? { ...entry, toastShown: true } : entry
      )
    );
  };

  return { errorStates, updateErrorState, setToastShown };
};

// Error handler to process different error cases
const handleApiError = (
  error: AxiosError | Error,
  location: Location<any>,
  setIsNetworkError: (value: boolean) => void,
  endpoint: string,
  errorStates: Array<{
    endpoint: string;
    errorExists: boolean;
    errorCount: number;
    toastShown: boolean;
  }>,
  updateErrorState: (
    endpoint: string,
    error: boolean,
    resetToast?: boolean
  ) => void,
  setToastShown: (endpoint: string) => void
) => {
  const setErrorState = (errorExists: boolean) => {
    updateErrorState(endpoint, errorExists);
  };

  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 400:
          if (!errorStates.find((e) => e.endpoint === endpoint)?.toastShown) {
            toast.error("Bad Request: Please check your submission.");
            setToastShown(endpoint);
          }
          setErrorState(true);
          break;
        case 401:
          if (location.pathname !== "/") {
            if (!errorStates.find((e) => e.endpoint === endpoint)?.toastShown) {
              toast.error("Unauthorized: Please log in again.");
              setToastShown(endpoint);
            }
            Cookies.remove("userData");
            window.location.href = "/";
          }
          setErrorState(true);
          break;
        case 403:
          // if (!errorStates.find((e) => e.endpoint === endpoint)?.toastShown) {
          //   toast.error(
          //     "Forbidden: You don't have permission to perform this action."
          //   );
          //   setToastShown(endpoint);
          // }
          // Cookies.remove("userData");
          // window.location.href = "/";
          setErrorState(true);
          break;
        default:
          setErrorState(true);
          break;
      }
    } else if (error.request) {
      setIsNetworkError(true);
      setErrorState(true);
    } else {
      console.error(`Unexpected Error: ${error.message}`);
      setErrorState(true);
    }
  }
};
