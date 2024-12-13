import { ChangeEvent, ReactNode, useEffect, useRef } from "react";
import { CgChevronDown } from "react-icons/cg";
import { useState } from "react";
import { LuImagePlus } from "react-icons/lu";

const Asterik = () => {
  return (
    <span className="mb-1.5">
      <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.51025 6.444L2.54225 4.588L0.86225 5.628L0.09425 4.428L1.90225 3.372L0.09425 2.3L0.87825 1.116L2.54225 2.172L2.51025 0.299999H3.93425L3.90225 2.156L5.56625 1.116L6.35025 2.3L4.54225 3.372L6.35025 4.428L5.55025 5.628L3.90225 4.604L3.93425 6.444H2.51025Z"
          fill="#FF0707"
        />
      </svg>
    </span>
  );
};

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
  value: string | number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onClick?: (event?: any) => void;
  disabled?: boolean;
  required: boolean;
  checked?: boolean;
  readOnly?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
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
    "file",
  ];

  if (similarTypes.includes(type)) {
    return (
      <>
        <div
          className={`relative autofill-parent ${
            type === "hidden" ? "hidden" : "flex"
          } ${style} ${disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"}
          items-center w-full max-w-full px-[1.1em] py-[1.25em] gap-1 rounded-3xl h-[48px] border-[0.6px]
          transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
          onClick={onClick}
        >
          <span
            className={`absolute flex -top-2 items-center justify-center text-[10px] text-textGrey font-semibold px-2 py-0.5 max-w-max h-4 bg-white border-[0.6px] border-strokeCream rounded-[200px] transition-opacity duration-500 ease-in-out
            ${value ? "opacity-100" : "opacity-0"}
            `}
          >
            {label.toUpperCase()}
          </span>

          {iconLeft && iconLeft}

          {required && <Asterik />}

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
            className={`w-full text-sm font-semibold ${
              value ? "text-textBlack" : "text-textGrey"
            } placeholder:text-textGrey placeholder:font-normal placeholder:italic`}
          />

          {iconRight && iconRight}
        </div>
        {errorMessage && (
          <p className="-mt-3 px-[1.1em] pb-2 text-sm text-errorTwo font-medium">
            {errorMessage}
          </p>
        )}
      </>
    );
  } else {
    return "Input Type Not Allowed";
  }
};

type ModalInputType = {
  type: string;
  name: string;
  label: string;
  value?: any[];
  placeholder: string;
  onClick: () => void;
  disabled?: boolean;
  required?: boolean;
  style?: string;
  errorMessage?: string;
  isItemsSelected?: boolean;
  itemsSelected: ReactNode;
};

export const ModalInput = ({
  type = "text",
  name,
  label,
  placeholder = "Enter your firstname",
  onClick,
  disabled = false,
  required = false,
  style,
  errorMessage,
  isItemsSelected,
  itemsSelected,
}: ModalInputType) => {
  return (
    <div className="flex items-center justify-center gap-2 w-full">
      <div
        className={`flex relative ${
          isItemsSelected ? "flex-col" : "flex-row"
        } items-center gap-[4px] ${style} ${
          disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"
        }  w-full max-w-full py-[1.25em] ${
          isItemsSelected ? "rounded-[20px]" : "rounded-3xl h-[48px]"
        } border-[0.6px] 
          transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent `}
      >
        {isItemsSelected && (
          <span className="absolute flex left-[1.6em] -top-2 z-50 items-center justify-center text-[10px] text-textGrey font-semibold px-2 py-0.5 max-w-max h-4 bg-white border-[0.6px] border-strokeCream rounded-[200px] transition-opacity duration-500 ease-in-out opacity-100">
            {label.toUpperCase()}
          </span>
        )}

        <div
          className={`flex items-center pl-[1.1em] ${
            isItemsSelected ? "w-full" : "w-max"
          }`}
        >
          {isItemsSelected ? (
            <span
              className="w-full text-sm font-semibold text-textBlack cursor-pointer"
              onClick={onClick}
            >
              Change {name} selected
            </span>
          ) : (
            required && <Asterik />
          )}
        </div>

        {isItemsSelected ? (
          <div
            className={`flex flex-col items-center justify-start not-italic text-textBlack w-full px-[1.1em] max-h-[550px] overflow-y-auto
            ${isItemsSelected ? "opacity-100" : "opacity-0"}
          
          `}
          >
            {itemsSelected}
          </div>
        ) : type === "button" ? (
          <span
            className="w-full text-sm text-textGrey italic cursor-pointer"
            onClick={onClick}
          >
            {placeholder}
          </span>
        ) : null}
      </div>
      {errorMessage && (
        <p className="-mt-3 px-[1.1em] pb-2 text-sm text-errorTwo font-medium">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export type FileInputType = {
  name: string;
  label: string;
  value?: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required: boolean;
  iconRight?: ReactNode;
  style?: string;
  errorMessage?: string;
  validateImagesOnly?: boolean;
};

export const FileInput = ({
  name,
  label,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  iconRight,
  style,
  errorMessage,
  validateImagesOnly = true,
}: FileInputType) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateImagesOnly) {
        if (file.type.startsWith("image/")) {
          setSelectedFile(file);
          onChange({
            target: {
              name,
              files: e.target.files, // Use files instead of value
            },
          } as unknown as React.ChangeEvent<HTMLInputElement>);
        } else {
          alert("Please select an image file.");
        }
      } else {
        setSelectedFile(file);
        onChange({
          target: {
            name,
            files: e.target.files, // Use files instead of value
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const openFile = () => {
    return (document.getElementById(name) as HTMLInputElement).click();
  };

  return (
    <>
      <div
        className={`relative autofill-parent flex
          ${style} 
          ${disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"}
          items-center w-full max-w-full h-[48px] px-[1.1em] py-[1.25em] 
          gap-1 rounded-3xl border-[0.6px] cursor-pointer
          transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
        onClick={openFile}
      >
        <span
          className={`absolute flex -top-2 items-center justify-center text-[10px] text-textGrey font-semibold px-2 py-0.5 max-w-max h-4 bg-white border-[0.6px] border-strokeCream rounded-[200px] transition-opacity duration-500 ease-in-out
            ${selectedFile ? "opacity-100" : "opacity-0"}
          `}
        >
          {label.toUpperCase()}
        </span>
        {required && <Asterik />}

        {/* Hidden file input */}
        <input
          type="file"
          id={name}
          name={name}
          onChange={handleFileChange}
          disabled={disabled}
          style={{ display: "none" }}
          accept={validateImagesOnly ? "image/*" : "*/*"}
        />
        {/* Custom button to trigger file input */}
        <div className="flex items-center justify-between w-full">
          <>
            <button
              type="button"
              disabled={disabled}
              className="text-sm text-textGrey italic"
            >
              {selectedFile ? (
                <span className="text-sm not-italic font-semibold text-textBlack">
                  {selectedFile.name}
                </span>
              ) : (
                placeholder
              )}
            </button>
          </>

          <span>
            {iconRight ? (
              iconRight
            ) : (
              <LuImagePlus color="black" title="Upload Image" />
            )}
          </span>
        </div>
      </div>
      {errorMessage && (
        <p className="-mt-3 px-[1.1em] pb-2 text-sm text-errorTwo font-medium">
          {errorMessage}
        </p>
      )}
    </>
  );
};

export const SmallFileInput = ({
  name,
  onChange,
  placeholder,
  iconRight,
  required,
}: {
  name: string;
  onChange: (e: any) => void;
  placeholder: string;
  iconRight?: ReactNode;
  required?: boolean;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      onChange(e);
    }
  };

  const openFile = () => {
    return (document.getElementById(name) as HTMLInputElement).click();
  };

  return (
    <div className="px-2 py-1 w-full max-w-[160px] border-[0.6px] border-strokeGreyThree rounded-full">
      {/* Hidden file input */}
      <input
        type="file"
        id={name}
        name={name}
        onChange={handleFileChange}
        style={{ display: "none" }}
        required={required}
      />
      {/* Custom button to trigger file input */}
      <div className="flex items-center justify-between w-full">
        <>
          <button type="button" onClick={openFile}>
            {selectedFile ? (
              <span className="text-xs text-textDarkGrey">
                {selectedFile.name}
              </span>
            ) : (
              <span className="text-xs text-textBlack text-ellipsis">
                {placeholder}
              </span>
            )}
          </button>
        </>

        <span onClick={openFile} className="cursor-pointer">
          {iconRight && iconRight}
        </span>
      </div>
    </div>
  );
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
  options: SelectOption[];
  value: string | string[];
  onChange: (values: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  style?: string;
  icon?: ReactNode;
  iconStyle?: string;
  iconPosition?: "left" | "right";
};

export const SelectInput = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  style,
  icon = <CgChevronDown color="black" title="Show options" />,
  iconStyle = "text-lg",
}: SelectInputType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [valueLabel, setValueLabel] = useState<string | number>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside as EventListener
      );
    } else {
      document.removeEventListener(
        "mousedown",
        handleClickOutside as EventListener
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside as EventListener
      );
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`relative w-full max-w-full`}>
      <div
        className={`relative flex items-center
        w-full max-w-full h-[48px] px-[1.25em] py-[1.25em] 
        rounded-3xl text-sm text-textGrey border-[0.6px] gap-1 cursor-pointer
        transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
        ${disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"}
        ${style}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span
          className={`absolute flex -top-2 items-center justify-center text-[10px] text-textGrey font-semibold px-2 py-0.5 max-w-max h-4 bg-white border-[0.6px] border-strokeCream rounded-[200px] transition-opacity duration-500 ease-in-out ${
            value ? "opacity-100" : "opacity-0"
          }`}
        >
          {label.toUpperCase()}
        </span>
        {required && <Asterik />}

        <div className="w-full">
          {value ? (
            <span className="font-semibold text-textBlack uppercase">
              {valueLabel}
            </span>
          ) : (
            <span className="text-textGrey italic">{placeholder}</span>
          )}
        </div>

        <span className={`${iconStyle} absolute right-3 p-[0.3em]`}>
          {icon}
        </span>
      </div>
      {isOpen && (
        <div className="absolute mt-1.5 flex flex-col gap-1 bg-white p-2 border border-strokeGreyTwo rounded-[20px] w-full max-h-60 overflow-y-auto shadow-lg z-10">
          {options.map((option) => (
            <div
              key={option.value}
              className="text-xs capitalize text-textDarkGrey cursor-pointer px-2 py-1 border border-transparent hover:bg-[#F6F8FA] hover:border hover:border-strokeGreyTwo hover:rounded-full"
              onClick={() => {
                handleSelect(option.value);
                setValueLabel(option.label);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export type MultipleSelectInputType = {
  label: string;
  options: SelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  style?: string;
  icon?: ReactNode;
  iconStyle?: string;
};

export const SelectMultipleInput = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select options",
  disabled = false,
  required = false,
  style,
  icon = <CgChevronDown />,
  iconStyle = "text-lg",
}: MultipleSelectInputType) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCheckboxChange = (optionValue: string) => {
    const updatedValue = value.includes(optionValue)
      ? value.filter((val) => val !== optionValue)
      : [...value, optionValue];
    onChange(updatedValue);
  };

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside as EventListener
      );
    } else {
      document.removeEventListener(
        "mousedown",
        handleClickOutside as EventListener
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside as EventListener
      );
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`relative w-full max-w-full `}>
      <div
        className={`relative flex items-center justify-between 
          ${style}
          ${disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"} 
          w-full h-[48px] px-[1.3em] py-[1em] cursor-pointer
          rounded-3xl text-sm text-textGrey border-[0.6px] gap-[4.23px]
          transition-all focus:outline-none focus:ring-2 focus:ring-primary`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span
          className={`absolute flex -top-2 items-center justify-center text-[10px] text-textGrey font-semibold px-2 py-0.5 max-w-max h-4 bg-white border-[0.6px] border-strokeCream rounded-[200px] 
            transition-opacity duration-500 ease-in-out
            ${value.length > 0 ? "opacity-100" : "opacity-0"}`}
        >
          {label.toUpperCase()}
        </span>

        {required && <Asterik />}

        <div className="w-full">
          {value.length > 0 ? (
            <span className="font-semibold text-textBlack">
              {value.length} selected
            </span>
          ) : (
            <span className="text-textGrey italic">{placeholder}</span>
          )}
        </div>
        <span className={`${iconStyle}`}>{icon}</span>
      </div>

      {isOpen && (
        <div className="absolute mt-1.5 flex flex-col gap-0 bg-white p-2 border border-strokeGreyTwo rounded-[20px] w-full max-h-60 overflow-y-auto shadow-lg z-10">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center text-xs capitalize text-textDarkGrey cursor-pointer px-2 py-1 border border-transparent hover:bg-[#F6F8FA] hover:border hover:border-strokeGreyTwo hover:rounded-full"
            >
              <input
                type="checkbox"
                value={option.value}
                checked={value.includes(option.value)}
                onChange={() => handleCheckboxChange(option.value)}
                className="mr-2 w-3 h-3"
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

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
