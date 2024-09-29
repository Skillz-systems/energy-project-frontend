import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-10 bg-color-text-one font-lexend text-white">
      <div className="flex items-center justify-center">
        <p className="font-bold text-4xl py-4 pr-6 mr-[0.75em] border-r border-gray-600">
          404
        </p>
        <p className="text-sm">The page you are looking for could not be found.</p>
      </div>
      <button
        className="border-1.5 border-slate-200 py-3 px-6 rounded hover:bg-slate-200 hover:text-color-text-one"
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        Return to Dashboard
      </button>
    </div>
  );
};

export default PageNotFound;
