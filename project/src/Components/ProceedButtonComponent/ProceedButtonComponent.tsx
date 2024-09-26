import React from 'react';
import ArrowButton from '../assets/Images/ArrowButton.png';

interface ButtonProps {
  onClick: () => void;
  className?: string;
}

const ProceedButton: React.FC<ButtonProps> = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center rounded-full ${className}`}
    >
      <img
        src={ArrowButton}
        alt="Proceed Arrow"
        className="w-[64px] h-[64px] transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:bg-white"
      />
    </button>
  );
};

export default ProceedButton;
