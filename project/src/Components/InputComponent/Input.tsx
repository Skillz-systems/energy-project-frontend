import { ChangeEvent, MouseEvent } from "react";

// Define all the props that the Input component will accept
export type InputType = {
  type?: string; // to handle various input types (text, password, etc.)
  name: string; // input name attribute
  onClick?: (event: MouseEvent<HTMLInputElement>) => void; // handle click events
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void; // handle change events
  placeholder?: string; // placeholder text for input fields
  value?: string | number; // value of the input
  label?: string; // optional label for the input
  disabled?: boolean; // disable the input
  style?: string; // allow custom Tailwind styles
};

// Reusable Input component
export const Input = ({
  type = "text", // default input type
  name,
  onClick,
  onChange,
  placeholder,
  value,
  label,
  disabled,
  style,
}: InputType) => {
  return (
    <div className={`mb-4 ${style ?? ""}`}>
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        onClick={onClick}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
          ${disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"} 
          border-gray-300 hover:border-blue-500 transition-all`}
      />
    </div>
  );
};
