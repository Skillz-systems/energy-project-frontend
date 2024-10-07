import { ChangeEvent, MouseEvent, ReactNode } from "react";
import { CgAsterisk, CgChevronDown } from "react-icons/cg";
import { useState } from "react";

type AllowedInputTypes =
  | "text"
  | "number"
  | "password"
  | "email"
  | "tel"
  | "date"
  | "search"
  | "url"
  | "file"
  | "hidden"
  | "radio"
  | "checkbox"
  | "reset";

export type InputType = {
  type: AllowedInputTypes;
  name: string;
  label: string;
  value?: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onClick?: (event: MouseEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required: boolean;
  checked?: boolean;
  readOnly?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  // iconCTA?
  style?: string;
  errorMessage?: string;
};

export const Input = ({
  type = "text",
  name,
  label,
  value,
  onChange,
  placeholder = "Enter your firstname",
  onClick,
  disabled = false,
  required = false,
  checked,
  readOnly = false,
  iconLeft,
  iconRight,
  style,
  errorMessage,
}: InputType) => {
  const similarTypes = [
    "text",
    "number",
    "email",
    "password",
    "search",
    "hidden",
    "tel",
    "url",
    "date",
  ];

  if (similarTypes.includes(type)) {
    return (
      <>
        <div
          className={`relative autofill-parent
          ${type === "hidden" ? "hidden" : "flex"} 
        ${style} 
        ${disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"}
        items-center w-full max-w-[400px] h-[48px] px-[1.1em] py-[1.25em] 
        gap-2 rounded-3xl border-[0.6px]
        transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent `}
        >
          {value && (
            <span
              className={`absolute flex -top-2 items-center justify-center text-[10px] text-textGrey font-semibold px-2 py-0.5 max-w-max h-4 bg-white border-[0.6px] border-strokeCream rounded-[200px] 
            transition-opacity duration-500 ease-in-out
            ${value ? "opacity-100" : "opacity-0"}`}
            >
              {label.toUpperCase()}
            </span>
          )}
          {iconLeft && iconLeft}
          {required && (
            <span className="mb-2 text-lg text-red-600">
              <CgAsterisk />
            </span>
          )}
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onClick={onClick}
            disabled={disabled}
            required={required}
            checked={checked}
            readOnly={readOnly}
            min={0}
            className="w-full text-sm font-semibold text-textBlack placeholder:text-textGrey placeholder:font-normal placeholder:italic"
          />
          {iconRight && iconRight}
        </div>
        {errorMessage && (
          <p className="mt-1 px-[1.1em] text-sm text-errorTwo font-medium">
            errorMessage
          </p>
        )}
      </>
    );
  } else {
    return "Input Type Not Allowed";
  }
};

export type RadioOption = {
  label: string;
  value: string;
  bgColour?: string;
  color?: string;
};

export type RadioInputType = {
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  radioOptions: RadioOption[];
  radioLayout?: "row" | "column";
  radioParentStyle?: string;
  radioSelectedStyle?: string;
};

export const RadioInput = ({
  name,
  onChange,
  required = false,
  radioOptions,
  radioLayout = "row",
  radioParentStyle,
  radioSelectedStyle,
}: RadioInputType) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleChange = (value: string) => {
    const event = {
      target: {
        value: value,
        name,
        type: "radio",
      },
    } as ChangeEvent<HTMLInputElement>;
    setSelectedValue(value);
    onChange(event);
  };

  return (
    <div
      className={`flex 
        ${radioParentStyle}
        ${radioLayout === "row" ? "flex-row" : "flex-col"} gap-2`}
    >
      {radioOptions.map((option, index) => (
        <label
          key={option.value}
          htmlFor={`${name}-${index}`}
          className={`flex items-center justify-center bg-white w-max max-w-[400px] h-[40px] px-[1em] py-[0.2em] 
            gap-3 rounded-3xl text-base text-center text-textGrey font-semibold transition-all
            border border-strokeGreyTwo cursor-pointer 
            ${
              selectedValue === option.value
                ? `${radioSelectedStyle} bg-primaryGradient text-white`
                : ""
            }`}
        >
          <input
            type="radio"
            id={`${name}-${index}`}
            name={name}
            value={option.value}
            onChange={() => handleChange(option.value)}
            required={required}
            className="hidden"
          />
          <span
            className="flex items-center justify-center"
            style={{ backgroundColor: option.bgColour, color: option.color }}
          >
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
};

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectInputType = {
  label: string;
  name: string;
  options: SelectOption[];
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  style?: string;
  icon?: ReactNode;
  iconStyle?: string;
  iconPosition?: "left" | "right";
  // selectmultipl
};

export const SelectInput = ({
  label,
  name,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  style,
  icon = <CgChevronDown />,
  iconStyle = "text-lg",
}: SelectInputType) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`relative flex items-center 
        ${style} 
        ${disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"} 
        w-full max-w-[400px] h-[48px] px-[1.1em] py-[1.25em] 
        rounded-3xl text-sm text-textGrey border-[0.6px] gap-2
        transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
        cursor-pointer ${value ? "border-strokeCream" : "border-strokeGrey"}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      {value && (
        <span
          className={`absolute flex -top-2 items-center justify-center text-[10px] text-textGrey font-semibold px-2 py-0.5 max-w-max h-4 bg-white border-[0.6px] border-strokeCream rounded-[200px] 
            transition-opacity duration-500 ease-in-out
            ${value ? "opacity-100" : "opacity-0"}`}
        >
          {label.toUpperCase()}
        </span>
      )}
      {required && (
        <span className="mb-2 text-lg text-red-600">
          <CgAsterisk />
        </span>
      )}
      <select
        name={name}
        value={value}
        onChange={(e) => {
          onChange(e);
          setIsOpen(false);
        }}
        disabled={disabled}
        required={required}
        className="w-full bg-transparent text-textBlack font-semibold outline-none appearance-none"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="capitalize"
          >
            {option.label}
          </option>
        ))}
      </select>

      <span
        className={`${iconStyle} absolute right-3 p-[0.3em] `}
        // rounded-full transition-all hover:bg-slate-200
      >
        {icon}
      </span>
    </div>
  );
};

// ALTERNATE SELECT COMPONENT START
// export const SelectInput = ({
//   name,
//   options,
//   value,
//   onChange,
//   placeholder = "Select an option",
//   disabled = false,
//   required = false,
//   style,
//   icon = <CgChevronDown />, // Default icon
//   iconStyle = "text-lg", // Icon style
//   iconPosition = "right", // Icon position
// }: SelectInputType) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleToggleDropdown = () => {
//     if (!disabled) {
//       setIsOpen((prev) => !prev);
//     }
//   };

//   const handleSelectOption = (selectedValue: string) => {
//     onChange(selectedValue); // Notify the parent component
//     setIsOpen(false); // Close the dropdown after selection
//   };

//   return (
//     <div
//       className={`relative flex items-center
//         ${style}
//         ${disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"}
//         w-full max-w-[400px] h-[48px] px-[1.1em] py-[1.25em]
//         rounded-3xl text-sm text-textGrey border-[0.6px] border-strokeGrey
//         transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
//         cursor-pointer`}
//       onClick={handleToggleDropdown} // Clicking the container toggles dropdown
//     >
//       {/* Display selected option or placeholder */}
//       <div className="flex-grow">
//         {value ? (
//           options.find((option) => option.value === value)?.label
//         ) : (
//           <span className="text-gray-400">{placeholder}</span>
//         )}
//       </div>

//       {/* Render the icon */}
//       <span
//         className={`${iconStyle} ${
//           iconPosition === "right" ? "absolute right-3" : "mr-3"
//         } p-[0.3em] rounded-full transition-all hover:bg-slate-200`}
//       >
//         {icon}
//       </span>

//       {/* Dropdown list */}
//       {isOpen && (
//         <ul className="absolute left-0 z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg top-full max-h-48">
//           {placeholder && (
//             <li
//               className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//               onClick={() => handleSelectOption("")}
//             >
//               {placeholder}
//             </li>
//           )}
//           {options.map((option) => (
//             <li
//               key={option.value}
//               className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//               onClick={() => handleSelectOption(option.value)}
//             >
//               {option.label}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };
// ALTERNATE SELECT COMPONENT END

export type ToggleInputType = {
  onChange: (checked: boolean) => void;
  defaultChecked?: boolean;
  disabled?: boolean;
};

export const ToggleInput = ({
  onChange,
  defaultChecked = false,
  disabled = false,
}: ToggleInputType) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    if (!disabled) {
      setIsChecked((prev) => {
        const newChecked = !prev;
        onChange(newChecked);
        return newChecked;
      });
    }
  };

  return (
    <div
      className={`relative inline-block w-16 h-10 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={handleToggle}
    >
      <div
        className={`absolute inset-y-1 inset-x-1 rounded-full transition-colors duration-300 border-[0.4px] ${
          isChecked
            ? "bg-[#FFF3D5] border-[#A58730]"
            : "bg-[#F6F8FA] border-[#CCD0DC]"
        }`}
      ></div>
      <div
        className={`absolute top-2.5 left-2.5 w-5 h-5 rounded-full shadow-md transition-transform duration-300 ${
          isChecked ? "transform translate-x-6 bg-[#A58730]" : "bg-[#CCD0DC]"
        }`}
      ></div>
    </div>
  );
};
