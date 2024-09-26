
import React from 'react';
import { ReactNode } from 'react';

interface ActionButtonProps {
  label?: string;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  icon,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  loading = false,
  ariaLabel,
}) => {
  const baseStyle =
    'rounded-full flex items-center justify-center transition duration-200 ease-in-out shadow-md';
  const variantStyles = {
    primary: 'bg-yellow-100 hover:bg-yellow-100 text-green ',
    secondary: 'bg-gray-300 hover:bg-gray-400 text-black',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
  };
  const sizeStyles = {
    small: 'px-3 py-1.5 text-xs',
    medium: 'px-5 py-2.5 text-sm',
    large: 'px-7 py-3 text-lg',
  };


  const buttonClass = `${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
    }`;

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5 mr-2 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
      ) : (
        <div className='flex items-center'>
          {icon && <span className="mr-2 text-xs">{icon}</span>}
          {label && <span className='font-medium text-[10px] font-["Red_Hat_Display"] leading-3  tracking-wide'>{label}</span>}
        </div>


      )}
    </button>
  );
};

export default ActionButton;
