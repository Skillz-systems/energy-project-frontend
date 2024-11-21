import useTokens from "../hooks/useTokens";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import useSWR from "swr";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
      return response;
    } catch (error: any) {
      handleApiError(error, location, setIsNetworkError);
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
  const [isNetworkError, setIsNetworkError] = useState<boolean>(false);

  // SWR fetcher function with axios
  const fetcher = async (url: string): Promise<any> => {
    try {
      const response = await apiClient.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsNetworkError(false);
      return response.data;
    } catch (error: any) {
      handleApiError(error, location, setIsNetworkError);
      throw error;
    }
  };

  const { data, error, isLoading, mutate } = useSWR(
    `${apiClient.defaults.baseURL}/api${endpoint}`,
    fetcher,
    {
      revalidateOnFocus: revalidate, // Revalidate on window focus
      refreshInterval: refreshInterval, // Set refresh interval
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
    isNetworkError,
  };
};

// Error handler to process different error cases
const handleApiError = (
  error: AxiosError | Error,
  location?: Location<any>,
  setIsNetworkError?: (value: boolean) => void
) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          // toast.error(
          //   "Bad Request: Please check your submission and try again."
          // );
          break;
        case 401:
          if (location.pathname === "/login") {
            return;
          } else {
            toast.error("Unauthorized: Please log in again.");
            Cookies.remove("userData");
            window.location.href = "/login";
          }
          break;
        case 403:
          toast.error(
            "Forbidden: You don't have permission to perform this action."
          );
          Cookies.remove("userData");
          window.location.href = "/login";
          break;
        default:
          break;
      }
    } else if (error.request) {
      setIsNetworkError(true);
    } else {
      console.error(`Unexpected Error: ${error.message}`);
    }
  }
};
