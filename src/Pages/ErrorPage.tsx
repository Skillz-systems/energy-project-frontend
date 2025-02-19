import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { TbAlertTriangleFilled } from "react-icons/tb";
import { KeyedMutator } from "swr";
import { ApiErrorStatesType } from "@/utils/useApiCall";

export default function ErrorPage({
  error,
  resetErrorBoundary,
}: {
  error: {
    title?: string;
    message?: string;
    statusCode?: number;
    isNetworkError?: boolean;
  };
  resetErrorBoundary: () => void;
}) {
  const networkError = error?.isNetworkError === true;
  const statusCode = error?.statusCode || 500;
  const title = error?.title || "Internal Server Error";
  const message = networkError
    ? "No Internet Connection, Try checking your network configuration."
    : "Sorry, something went wrong on our end. We're working to fix it.";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Error content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full px-4 sm:px-6 lg:px-6">
          <div className="text-center">
            <div className="relative">
              <svg height="0" width="0">
                <defs>
                  <linearGradient
                    id="errorGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "#982214", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#473b15", stopOpacity: 1 }}
                    />
                  </linearGradient>
                </defs>
              </svg>

              <TbAlertTriangleFilled
                className="mx-auto h-20 w-20"
                style={{
                  fill: "url(#errorGradient)",
                }}
              />
            </div>
            <h1 className="mt-4 text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">
              {statusCode}
            </h1>
            <h2 className="mt-2 text-3xl font-semibold text-gray-700">
              {title}
            </h2>
            <p className="mt-2 text-lg text-gray-500">{message}</p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row mt-6">
              {!networkError && (
                <Link
                  to={"/home"}
                  className="inline-flex items-center px-5 py-2 text-base font-medium rounded-md text-white bg-errorGradient hover:bg-inversedErrorGradient transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  onClick={resetErrorBoundary}
                >
                  Go back home
                </Link>
              )}
              <div
                className="inline-flex items-center px-5 py-2 text-base font-medium rounded-md text-white bg-errorGradient hover:bg-inversedErrorGradient transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer"
                onClick={() => {
                  resetErrorBoundary();
                  window.location.reload();
                }}
              >
                Refresh
              </div>
            </div>
            {!networkError && (
              <p className="mt-4 text-[15px] text-gray-500">
                If this problem persists, please contact our support team by
                sending an email to{" "}
                <a
                  href="mailto:support@a4tpowersolutions.com"
                  className="text-primary hover:underline"
                >
                  support@a4tpowersolutions.com
                </a>
                .
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const ErrorComponent = ({
  message,
  className,
  refreshData,
  errorData,
}: {
  message: string;
  className?: string;
  refreshData?: KeyedMutator<any>;
  errorData: ApiErrorStatesType;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const previousErrorCount = useRef(errorData?.errorStates[0]?.errorCount);

  const handleRefetch = async () => {
    setLoading(true);
    try {
      if (refreshData && errorData?.errorStates[0]?.errorCount < 5) {
        await refreshData();
      } else window.location.reload();
    } catch {
      setLoading(false);
    }
    // Check if error count has changed, and if so, stop the loading state
    if (errorData?.errorStates[0]?.errorCount !== previousErrorCount?.current) {
      setLoading(false);
    }
    // Update the previous error count for future comparisons
    previousErrorCount.current = errorData?.errorStates[0]?.errorCount;
  };

  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-full py-12 px-4 bg-gray-100 ${className}`}
    >
      <div className="relative">
        <svg height="0" width="0">
          <defs>
            <linearGradient
              id="errorGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#982214", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#473b15", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>
        </svg>
        <TbAlertTriangleFilled
          className="mx-auto h-16 w-16"
          style={{ fill: "url(#errorGradient)" }}
        />
      </div>
      <p className="mt-2 text-base sm:text-lg text-primary text-center font-semibold sm:max-w-[65%]">
        {errorData?.isNetworkError
          ? "No Internet Connection, Try checking your network configuration."
          : "Internal Server Error."}
      </p>
      <p className="text-sm text-textBlack text-center">
        {errorData?.errorStates[0]?.errorCount < 5
          ? message
          : "Blocked fetch dues to multiple failed errors. Try again later."}
      </p>
      <div
        className="mt-6 inline-flex items-center px-5 py-2 text-base font-medium rounded-md text-white bg-errorGradient hover:bg-inversedErrorGradient transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer"
        onClick={handleRefetch}
      >
        {loading
          ? "Refetching..."
          : errorData?.errorStates[0]?.errorCount < 5
          ? "Refetch"
          : "Refresh"}
      </div>
    </div>
  );
};
