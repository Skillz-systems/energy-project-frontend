import useTokens from "../hooks/useTokens";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import useSWR from "swr";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { Location, useLocation } from "react-router-dom";

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
      handleApiError(error, location);
      throw error;
    }
  };

  return {
    apiCall,
  };
};

// SWR hook for GET requests with revalidation
export const useGetRequest = (
  endpoint: string,
  revalidate = true,
  refreshInterval?: number
) => {
  const { token } = useTokens();

  // SWR fetcher function with axios
  const fetcher = async (url: string): Promise<any> => {
    try {
      const response = await apiClient.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      handleApiError(error);
      throw error;
    }
  };

  const { data, error, isLoading, mutate } = useSWR(
    `${apiClient.defaults.baseURL}/api${endpoint}`,
    fetcher,
    {
      revalidateOnFocus: revalidate, // Revalidate on window focus
      revalidateOnReconnect: revalidate, // Revalidate on reconnect
      refreshInterval: refreshInterval, // Set refresh interval
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

// Error handler to process different error cases
const handleApiError = (
  error: AxiosError | Error,
  location?: Location<any>
) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          toast.error("Bad Request: Please check your input and try again.");
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
        case 404:
          toast.error("Not Found: The requested resource does not exist.");
          break;
        case 405:
          toast.error("Method Not Allowed: Please check your request method.");
          break;
        case 500:
          toast.error("Server Error: Please try again later.");
          break;
        default:
          toast.error(`Error: ${error.response.data.message}`);
      }
    } else if (error.request) {
      toast.error("Network Error: Please check your connection.");
    } else {
      toast.error(`Unexpected Error: ${error.message}`);
    }
  } else {
    toast.error(`Error: ${error.message}`);
  }
};
