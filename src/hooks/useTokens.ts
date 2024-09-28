// import Cookies from "js-cookie";

const useTokens = () => {
  // Safely get and parse userData from cookies
  // const userData = Cookies.get("userData");

  // try {
  //   const parsedData = userData ? JSON.parse(userData) : null;
  //   // Safely access token
  //   return {
  //     token: parsedData?.token,
  //   };
  // } catch (error) {
  //   console.error("Error parsing userData cookie:", error);
  //   return { token: undefined };
  // }

  // REWORK CODE ABOVE FOR WHEN AUTH APIS ARE READY
  return { token: "gdg2e763y23bhwd2y23763gy3bdbgu2g2e7623tebgu22" };
};

export default useTokens