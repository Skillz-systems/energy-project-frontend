import React from 'react';

const ProgressBar = ({ percentage }) => {
  const progressBarColor = getProgressBarColor(percentage);

  return (
    <div className="w-full bg-gray-100 rounded-full h-[20px] overflow-hidden relative">
      <div
        className={`h-full ${progressBarColor} rounded-full flex items-center justify-end transition-all duration-300 pr-2`}
        style={{ width: `${percentage}%` }}
      >
        <span className="text-black text-[12px] font-bold">
          {`${percentage}%`}
        </span>
      </div>
    </div>
  );
};

function getProgressBarColor(percentage) {
  if (percentage >= 90 && percentage <= 100) return 'bg-green-300';
  if (percentage >= 60 && percentage < 80) return 'bg-blue-500';
  if (percentage >= 50 && percentage < 60) return 'bg-purple-500';
  if (percentage >= 40 && percentage < 50) return 'bg-yellow-500';
  if (percentage >= 30 && percentage < 40) return 'bg-amber-500';
  return 'bg-red-500'; 
}

export default ProgressBar;
