import React from 'react';

interface IconProps {
  icon: React.ElementType | string;  // The icon component or identifier
  title?: string;  // Optional title
  size?: 'small' | 'medium' | 'large' | number;  // Predefined sizes or custom numeric size
  color?: string;  // Optional color for the icon
  position?: 'left' | 'right' | 'top' | 'bottom';  // Title positioning relative to icon
  onClick?: () => void;  // Optional click handler
  className?: string;  // Additional class names for styling
}

const Icon: React.FC<IconProps> = ({
  icon: IconComponent,  // The icon (either a string or a React component)
  title,
  size = 'medium',
  color = 'currentColor',
  position = 'right',
  onClick,
  className,
}) => {
  // Define size classes for Tailwind CSS and handle custom numeric size
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  // Define position classes for flex layout
  const positionClasses = {
    left: 'flex-row-reverse',
    right: 'flex-row',
    top: 'flex-col',
    bottom: 'flex-col-reverse',
  };

  // Handle size either via class or inline style
  const iconSize = typeof size === 'number' ? { fontSize: `${size}px` } : { className: sizeClasses[size] };

  return (
    <div
      className={`flex items-center ${positionClasses[position]} ${className}`}
      onClick={onClick}
      role="button"
      aria-label={title || 'icon'}
      tabIndex={onClick ? 0 : undefined}  // Allow focus for clickable icons
    >
      {/* Render string-based icons (e.g., Font Awesome or custom SVG) */}
      {typeof IconComponent === 'string' ? (
        <i
          className={`${IconComponent} ${iconSize.className || ''}`}
          style={{ ...iconSize, color }}  // Added support for color for string-based icons
        />
      ) : (
        // Render React components (e.g., Material UI Icons)
        <IconComponent
          style={{ ...iconSize, color }}  // Apply inline styles for color and size
          className={color}  // Allow Tailwind color classes if applicable
        />
      )}

      {/* Conditionally render the title with appropriate spacing */}
      {title && (
        <span
          className={`${sizeClasses[size as keyof typeof sizeClasses]} ml-2`}
        >
          {title}
        </span>
      )}
    </div>
  );
};

export default Icon;
