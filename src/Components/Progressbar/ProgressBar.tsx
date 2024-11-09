import React from 'react';

interface ProgressBarProps {
  percentage: number; // Progress percentage (0-100)
  height?: string; // Optional height for the bar
  width?: string; // Optional width for the bar
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, height = '20px', width = '100%' }) => {
  
  // Function to get color based on the percentage
  const getColor = (percentage: number) => {
    if (percentage >= 80) return 'green';  // A
    if (percentage >= 60) return 'blue';   // B
    if (percentage >= 50) return 'purple'; // C
    if (percentage >= 40) return 'yellow'; // D
    if (percentage >= 30) return 'amber';  // E
    return 'red';  // F
  };

  // Apply color based on percentage
  const progressBarColor = getColor(percentage);

  return (
    <div style={{ width: width, height: height, backgroundColor: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
      <div
        style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: progressBarColor,
          transition: 'width 0.3s ease-in-out',
        }}
      />
    </div>
  );
};

export default ProgressBar;
