import Cookies from "js-cookie";

const useTokens = () => {
  // Safely get and parse userData from cookies
  const userData = Cookies.get("userData");

  try {
    const parsedData = userData ? JSON.parse(userData) : null;
    // Safely access token
    return {
      token: parsedData?.token,
      userId: parsedData?.user?.id,
      userRoleId: parsedData?.user?.role?.id,
    };
  } catch (error) {
    console.error("Error parsing userData cookie:", error);
    return { token: undefined, userId: undefined, userRoleId: undefined };
  }
};

export default useTokens