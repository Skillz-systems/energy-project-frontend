import useTokens from "../hooks/useTokens";
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import useSWR from "swr";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create an axios instance
const baseURL = process.env.VITE_API_URL
const apiClient = axios.create({
  baseURL: baseURL as string,
});

// SWR fetcher function with axios
const fetcher = async (
  url: string,
  token: string
): Promise<AxiosResponse<any>> => {
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

// API call for POST, PUT, DELETE, PATCH requests
interface ApiCallOptions {
  endpoint: string;
  method: "post" | "put" | "delete" | "patch";
  params?: any;
  data?: any;
  headers?: any;
  successMessage?: string;
}

export const useApiCall = () => {
  const { token } = useTokens();

  const apiCall = async <T>({
    endpoint,
    method,
    params = {},
    data = {},
    headers = {},
    successMessage = "Successful",
  }: ApiCallOptions): Promise<T> => {
    const baseURL = `${process.env.VITE_API_URL}/api`;

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
      if (response.status >= 200 && response.status < 300) {
        toast.success(successMessage);
      }
      return response.data;
    } catch (error: any) {
      handleApiError(error);
      throw error;
    }
  };

  return {
    apiCall,
  };
};

// SWR hook for GET requests with revalidation
export const useGetRequest = (endpoint: string, revalidate = true) => {
  const { token } = useTokens();
  const { data, error, mutate } = useSWR(
    [`${apiClient.defaults.baseURL}/api${endpoint}`, token],
    fetcher,
    {
      revalidateOnFocus: revalidate, // Revalidate on window focus
      revalidateOnReconnect: revalidate, // Revalidate on reconnect
    }
  );

  return {
    data,
    error,
    isLoading: !error && !data,
    mutate,
  };
};

// Error handler to process different error cases
const handleApiError = (error: AxiosError | Error) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          toast.error("Bad Request: Please check your input and try again.");
          break;
        case 401:
          toast.error("Unauthorized: Please log in again.");
          break;
        case 403:
          toast.error(
            "Forbidden: You don't have permission to perform this action."
          );
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
          toast.error(`Error: ${error.response.statusText}`);
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
