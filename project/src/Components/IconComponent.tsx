import React from 'react';

interface IconProps {
  icon: React.ElementType | string;  // Accepts either a component or a string identifier
  title?: string;
  size?: 'small' | 'medium' | 'large' | number;  // Allows predefined or custom numeric size
  color?: string;  // Optional icon color
  position?: 'left' | 'right' | 'top' | 'bottom';  // Title positioning relative to icon
  onClick?: () => void;  // Optional click handler
  className?: string;  // Additional class names for styling
}

const Icon: React.FC<IconProps> = ({
  icon: IconComponent,  // The icon component or identifier
  title,
  size = 'medium',
  color = 'currentColor',
  position = 'right',
  onClick,
  className,
}) => {
  // Map predefined size values to CSS classes or inline styles
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  // Flex classes to position the title relative to the icon
  const positionClasses = {
    left: 'flex-row-reverse',
    right: 'flex-row',
    top: 'flex-col',
    bottom: 'flex-col-reverse',
  };

  // Determine the icon size (either class-based or inline style)
  const iconSize = typeof size === 'number' ? { fontSize: `${size}px` } : { className: sizeClasses[size] };

  return (
    <div
      className={`flex items-center ${positionClasses[position]} ${className}`}
      onClick={onClick}
      role="button"
      aria-label={title || 'icon'}
      tabIndex={onClick ? 0 : undefined}  // Make the element focusable if clickable
    >
      {typeof IconComponent === 'string' ? (
        // Handle custom SVG or Font Awesome icons using <i> or <svg> with the string identifier
        <i className={`${IconComponent} ${iconSize.className || ''}`} style={iconSize} />
      ) : (
        // Render the passed React component dynamically (e.g., Material UI icon)
        <IconComponent style={iconSize} className={color} />
      )}

      {/* Conditionally render the title */}
      {title && (
        <span className={`${sizeClasses[size as keyof typeof sizeClasses]} ml-2`}>
          {title}
        </span>
      )}
    </div>
  );
};

export default Icon;
