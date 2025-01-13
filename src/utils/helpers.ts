import { useNavigate, useLocation } from "react-router-dom";
import useTokens from "../hooks/useTokens";
import { useEffect } from "react";
import { toast } from "react-toastify";

export function copyToClipboard(value: any) {
  if (!navigator.clipboard) {
    return;
  }

  const textToCopy = String(value);

  navigator.clipboard.writeText(textToCopy).then(() => {
    toast.info(`Copied "${textToCopy}" to clipboard.`);
  });
}

export const formatDateTime = (
  format: "date" | "time" | "datetime",
  dateString: string
) => {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // 12-hour format conversion
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12; // Convert 0 (midnight) to 12

  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes}${ampm}`;

  if (format === "date") {
    return formattedDate;
  } else if (format === "time") {
    return formattedTime;
  } else {
    return `${formattedDate}; ${formattedTime}`;
  }
};

export function capitalizeFirstLetter(str: string) {
  if (!str) return str; // Return the original string if it's empty or undefined
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatNumberWithCommas(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function useIsLoggedIn(route: string) {
  const { token } = useTokens();
  const navigate = useNavigate();
  const sessionRedirect = sessionStorage.getItem("redirect");

  useEffect(() => {
    if (token) {
      navigate(sessionRedirect || route);
    }
  }, [token, navigate, route, sessionRedirect]);
}

export const useScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Ensure the scroll position resets
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);
};

export const checkIfArraysAreEqual = (arr1: string[], arr2: string[]) => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item) => arr2.includes(item));
};
