import { capitalizeFirstLetter } from "@/utils/helpers";
import { ReactNode } from "react";

const ApiErrorMessage = ({
  apiError,
}: {
  apiError: string | Record<string, string[]> | null;
}): ReactNode => {
  if (!apiError || apiError === "") return null;

  return (
    <div className="p-3 mt-4 border border-red-500 rounded-md bg-red-50">
      {typeof apiError === "string" ? (
        <p className="text-sm text-red-600">{apiError}</p>
      ) : (
        Object.keys(apiError).map((key) => (
          <p key={key} className="text-sm text-red-600">
            <strong>{capitalizeFirstLetter(key)}:</strong>{" "}
            {apiError[key].join(", ")}
          </p>
        ))
      )}
    </div>
  );
};

export default ApiErrorMessage;
