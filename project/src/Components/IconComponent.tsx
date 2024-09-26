import React from 'react';
import clsx from 'clsx';

interface IconProps {
  icon: React.ElementType | string;  // Can be either a component (icon) or a string (image source)
  title?: string;
  size?: number;  // Use number for font-size directly
  color?: string;
  onClick?: () => void;
  className?: string;
  titleClassName?: string;
  iconClassName?: string;
}

const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  title,
  size = 16, // Default size in pixels
  color = 'currentColor',
  onClick,
  className,
  titleClassName,
  iconClassName,
}) => {

  return (
    <div
      className={clsx('flex items-center cursor-pointer', className)}  // No need for positionClasses anymore
      onClick={onClick}
      role="button"
      aria-label={title || 'icon'}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Check if IconComponent is a string (image path) or a component */}
      {typeof IconComponent === 'string' ? (
        <img
          src={IconComponent}
          alt={title || 'icon image'}
          className={clsx(iconClassName)} // Handle image class styling via iconClassName
          style={{ width: size, height: size }} // Image size handled by props
        />
      ) : (
        <IconComponent
          style={{ fontSize: `${size}px`, color }}  // Font size and color for the icon
          className={clsx(iconClassName)} // Icon component class styling
        />
      )}

      {/* Render title if provided */}
      {title && (
        <span className={clsx(titleClassName)}>
          {title}
        </span>
      )}
    </div>
  );
};

export default Icon;
