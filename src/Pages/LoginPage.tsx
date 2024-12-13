import { Suspense, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useTokens from "../hooks/useTokens";
import loginbg from "../assets/loginbg.png";
import logo from "../assets/logo.svg";
import eyeclosed from "../assets/eyeclosed.svg";
import eyeopen from "../assets/eyeopen.svg";
import { Input } from "../Components/InputComponent/Input";
import ProceedButton from "../Components/ProceedButtonComponent/ProceedButtonComponent";
import { useApiCall } from "../utils/useApiCall";
import Cookies from "js-cookie";
import LoadingSpinner from "../Components/Loaders/LoadingSpinner";
import { useIsLoggedIn } from "../utils/helpers";

const LoginPage = () => {
  const { token } = useTokens();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { apiCall } = useApiCall();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useIsLoggedIn("/home");
  if (token) return null;

  const redirectPath = searchParams.get("redirect");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiCall({
        endpoint: "/v1/auth/login",
        method: "post",
        data: {
          email,
          password,
        },
        headers: {},
        successMessage: "Login Successful!",
      });

      const userData = {
        token: response.headers.access_token,
        ...response.data,
      };
      Cookies.set("userData", JSON.stringify(userData), {
        expires: 7,
      }); // Token expires in 7 days
      navigate(redirectPath || "/home");
    } catch (error: any) {
      console.error("Login failed:", error);
      setErrorMessage(error?.response?.data?.message);
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiCall({
        endpoint: "/v1/auth/forgot-password",
        method: "post",
        data: {
          email,
        },
        headers: {},
        successMessage: "Password reset email sent!",
      });
    } catch (error) {
      console.error("Forgot password failed:", error);
    }
    setLoading(false);
  };

  return (
    <Suspense
      fallback={
        <LoadingSpinner parentClass="flex items-center justify-center w-full h-full" />
      }
    >
      <main className="relative flex flex-col items-center justify-center gap-[60px] px-4 py-16 w-full min-h-screen">
        <img
          src={loginbg}
          alt="background"
          className={`absolute w-full h-full object-cover object-center ${
            email || password ? "opacity-60" : "opacity-40"
          }`}
        />

        <img src={logo} alt="Logo" className="w-[120px] z-10" />
        <section className="flex w-full flex-col items-center justify-center gap-2 z-10 max-w-[500px]">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-[32px] text-primary font-medium font-secondary">
              {isForgotPassword ? "See who forgot something" : "Welcome Back"}
            </h1>
            <em className="text-xs text-textDarkGrey text-center max-w-[220px]">
              {isForgotPassword
                ? "Input your email below, we will send you a link to help resent your password."
                : "Sign In to Access your Workplace"}
            </em>
          </div>
          <form
            className="flex w-full flex-col items-center justify-center pt-[50px] pb-[24px]"
            onSubmit={isForgotPassword ? handleForgotPassword : handleLogin}
          >
            <Input
              type="email"
              name="email"
              label="EMAIL"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage("");
              }}
              placeholder="Email"
              required={true}
              errorMessage=""
              style={`mb-4 ${
                email || password ? "border-strokeCream" : "border-strokeGrey"
              }`}
            />
            {!isForgotPassword ? (
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                label="PASSWORD"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                placeholder="Password"
                required={true}
                errorMessage=""
                style={`${
                  email || password ? "border-strokeCream" : "border-strokeGrey"
                }`}
                iconRight={
                  <img
                    src={showPassword ? eyeopen : eyeclosed}
                    className="w-[16px] cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                }
              />
            ) : null}
            {errorMessage ? (
              <p className="text-md font-medium mt-2">{errorMessage}</p>
            ) : null}
            <div className="flex flex-col items-center justify-center gap-8 pt-8">
              <ProceedButton
                type="submit"
                loading={loading}
                variant={email || password ? "gradient" : "gray"}
              />
              {isForgotPassword ? (
                <em
                  className={`${
                    email ? "text-textDarkGrey" : "text-white"
                  } text-sm font-medium underline cursor-pointer`}
                  onClick={() => setIsForgotPassword(false)}
                >
                  Back to Login
                </em>
              ) : (
                <em
                  className={`${
                    email || password ? "text-textDarkGrey" : "text-white"
                  } text-sm font-medium underline cursor-pointer`}
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot password?
                </em>
              )}
            </div>
          </form>
        </section>
      </main>
    </Suspense>
  );
};

export default LoginPage;
